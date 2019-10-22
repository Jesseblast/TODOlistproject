/**
 * TODOlistproject - Jesse Könönen
 * AssignmentsScreen.js
 * 
 * 
 */

import React, { useState } from "react";
import { View, Text, Button, FlatList, Alert, AsyncStorage } from "react-native";
import { styles } from "./style";
import { NavigationEvents } from "react-navigation";
import { TouchableOpacity } from "react-native-gesture-handler";

export const AssignmentsScreen = (props) => {
    const [assignments, setAssignments] = useState([]); // List of assignment objects

    // Fetches all assignments from persistent memory
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

    // Clear data for demo purposes (Delete later!)
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
                renderItem={({item}) => { 
                    return (
                        <View style={{width: 300, height: 30, borderWidth: 2, borderColor: "#666", margin: 8, padding: 4}}>
                            <TouchableOpacity onPress={() => props.navigation.navigate("EditAssignment", {key: item.key})}>
                                <Text style={{fontSize: 16}}>{item.title}</Text>
                            </TouchableOpacity>
                        </View>
                    ) 
                }}
            />

            {/* Clear all assignments for demoing purposes (remember to delete later!) */}
            <Button 
                title="Clear all (DEMO)"
                onPress={clear}
            />

        </View>
    )
}

