/**
 * 
 * 
 * 
 * 
 */

import React, { useState } from "react";
import { View, Text, FlatList, Alert, AsyncStorage } from "react-native";
import { styles } from "./style";
import { NavigationEvents } from "react-navigation";
import { TouchableOpacity } from "react-native-gesture-handler";

export const CompletedAssignmentsScreen = (props) => {
    const [assignments, setAssignments] = useState([]);

    // Fetch all assignments from persistent memory
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



    return (
        <View style={styles.viewContainer}>

            {/* Update assignments container */}
            <NavigationEvents 
                onWillFocus={getAssignments}
            />

            <Text style={styles.header}>Completed Assignments</Text>

            <FlatList 
                style={{alignContent: "flex-start"}}
                data={assignments}
                renderItem={({item}) => { 
                    if (!item.completed) return; // Skip if the assignment is not completed

                    return (
                        <View style={{width: 300, height: 30, borderWidth: 2, borderColor: "#666", margin: 8, padding: 4}}>
                            <TouchableOpacity onPress={() => props.navigation.navigate("EditAssignment", {key: item.key})}>
                                <Text style={{fontSize: 16}}>{item.title}</Text>
                            </TouchableOpacity>
                        </View>
                    ) 
                }}
            />
        </View>
    )
}
