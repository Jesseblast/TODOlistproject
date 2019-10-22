/**
 * TODOlistproject - Jesse Könönen
 * AssignmentsTab.js
 * 
 * 
 */

import React, { useState, useEffect } from "react";
import { createStackNavigator } from "react-navigation-stack";
import { View, Text, Button, TextInput, FlatList, Alert, AsyncStorage } from "react-native";
import { styles } from "./style";
import { NavigationEvents } from "react-navigation";


// ---
const AssignmentsScreen = (props) => {
    const [assignments, setAssignments] = useState([]);

    const getAssignments = async () => {
        try {
            const items = await AsyncStorage.getItem("items");

            if (items) {
                const restoredData = JSON.parse(items);
                setAssignments(restoredData);
                return true;
            }
        } catch (error) {
            Alert.alert("Error loading data!");
        }
    }

    // Clear data for demo purposes
    const clear = async () => {
        try {
            await AsyncStorage.removeItem("items");
            console.log("Data cleared"); setAssignments([]); return true;
        } catch (error) {
            console.log("Error clearing data"); setAssignments([]); return false;
        }
    }

    return (
        <View style={styles.viewContainer}>

            {/* Update assignments container */}
            <NavigationEvents 
                onWillFocus={getAssignments}
            />

            <Button 
                title="Add new assignment"
                onPress={() => props.navigation.navigate("NewAssignment")}
            />
            <Text>TOTAL ITEMS: {assignments.length}</Text>

            <FlatList 
                style={{alignContent: "flex-start"}}
                data={assignments}
                renderItem={({item}) => { return (<Text style={{fontSize: 16}}>{item.title}</Text>) }}
            />

            {/* Clear all for demoing */}
            <Button 
                title="Clear all (DEMO)"
                onPress={clear}
            />

        </View>
    )
}


// ---
const NewAssignmentScreen = (props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [expiration, setExpiration] = useState("");
    const [location, setLocation] = useState("");

    // Clear all input
    const clear = () => {
        setTitle("");
        setDescription("");
        setExpiration("");
        setLocation("");
    }

    // Save the new assignment
    const save = async () => {

        // Assignment data
        var data = {
            key: "0",
            completed: false,                // Is this assignment completed?
            title: title,
            description: description,
            expiration: expiration,
            location: location,
        }

        // Fetch any existing data
        try {
            const items = await AsyncStorage.getItem("items");
            
            // Assignments list exists
            if (items) {
                const restoredData = JSON.parse(items);

                // Find the latest id and add one to it 
                var newKey = restoredData[restoredData.length - 1].key + 1;
                data.key = newKey;

                const dataArray = [...restoredData, data];
                const stringifiedData = JSON.stringify(dataArray);
                await AsyncStorage.setItem("items", stringifiedData);

                console.log("New assignment saved <key: " + data.key 
                + ", completed: " + data.completed
                + ", title: " + data.title
                + ", description: " + data.description
                + ", expiration: " + data.expiration
                + ", location: " + data.location + ">");
            }

            // Assignments list is empty, this is the first entry
            else {
                const dataArray = [data];
                const stringifiedData = JSON.stringify(dataArray);
                await AsyncStorage.setItem("items", stringifiedData);

                console.log("New assignment saved <key: " + data.key 
                + ", completed: " + data.completed
                + ", title: " + data.title
                + ", description: " + data.description
                + ", expiration: " + data.expiration
                + ", location: " + data.location + ">");
            }

        } catch (error) {
            Alert.alert("Error fetching data!");
        }

        props.navigation.goBack();
    }

    return (
        <View style={styles.viewContainer}>
            <Text style={styles.header}>Add new assignment</Text>

            {/* Set title for new assignment */}
            <Text>Title</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={(title) => setTitle(title)}
                value={title}
            />

            {/* Set description for new assignment */}
            <Text>Description</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={(description) => setDescription(description)}
                value={description}
            />

            {/* Set expiration day for new assignment */}
            <Text>Expiration day</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={(expiration) => setExpiration(expiration)}
                value={expiration}
            />

            {/* Set location for new assignment */}
            <Text>Location</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={(location) => setLocation(location)}
                value={location}
            />

            <Button 
                title="Clear"
                onPress={clear}
            />

            <Button 
                title="Save"
                onPress={save}
            />
            
        </View>
    )
}



/* ******************************************************* */
export const AssignmentsTab = createStackNavigator(
    {
        Assignments: AssignmentsScreen,
        NewAssignment: NewAssignmentScreen
    },
    {
        initialRouteName: "Assignments"
    }
)
