/**
 * TODOlistproject - Jesse Könönen
 * EditAssignmentScreen.js
 * 
 * 
 */

import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert, AsyncStorage } from "react-native";
import { styles } from "./style";

export const EditAssignmentScreen = (props) => {
    const [assignments, setAssignments] = useState(undefined);  // All assignments
    const [assignment, setAssignment] = useState(undefined);    // The assignment that's being edited
    const [assignmentIndex, setAssignmentIndex] = useState(0);  // And the index of the assignment that's being edited
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [expiration, setExpiration] = useState("");
    const [location, setLocation] = useState("");
    const [completed, setCompleted] = useState(null);           // Is the assignment completed?

    useEffect(() => { loadAssignments(); }, [])
    useEffect(() => { findAssignment(props.navigation.getParam("key")) }, [assignments]);
    useEffect(() => { setValues(); }, [assignment]);

    // Load all assignments
    const loadAssignments = async () => {
        try {
            const items = await AsyncStorage.getItem("items");
            if (items) {
                var restoredData = JSON.parse(items);
                setAssignments(restoredData);
            }
        } catch (error) {
            Alert.alert("Error loading data!");
        }
    }

    // Save edited assignment
    const saveAssignment = async() => {
        assignments[assignmentIndex].title = title;
        assignments[assignmentIndex].description = description;
        assignments[assignmentIndex].expiration = expiration;
        assignments[assignmentIndex].location = location;
        assignments[assignmentIndex].completed = completed;

        try {
            const stringifiedData = JSON.stringify(assignments);
            await AsyncStorage.setItem("items", stringifiedData);
        } catch (error) {
            Alert.alert("Error saving data!");
        }

        props.navigation.goBack();
    }

    // Find assignment by key
    const findAssignment = (key) => {
        if (assignments === undefined) return;
        setAssignment(assignments.find((item) => item.key === key));
        setAssignmentIndex(assignments.findIndex((item) => item.key === key));
    }

    // Set local variables
    const setValues = () => {
        if (assignment === undefined) return;
        setTitle(assignment.title);
        setDescription(assignment.description);
        setExpiration(assignment.expiration);
        setLocation(assignment.location);
        setCompleted(assignment.completed);
    }

    // Clear all input
    const reset = () => {
        setTitle(assignment.title);
        setDescription(assignment.description);
        setExpiration(assignment.expiration);
        setLocation(assignment.location);
        setCompleted(assignment.completed);
    }

    // Delete this assignment
    const deleteAssignment = async () => {
        console.log("Deleting");
        const newDataArray = assignments;
        newDataArray.splice(assignmentIndex, 1);

        try {
            const stringifiedData = JSON.stringify(newDataArray);
            await AsyncStorage.setItem("items", stringifiedData);
        } catch (error) {
            Alert.alert("Error saving data!");
        }

        props.navigation.goBack();
    }


    return (
        <View style={styles.viewContainer}>
            <Text style={styles.header}>Edit "{title}"</Text>

            {completed ? (
                <Button
                    title="Mark as incomplete"
                    onPress={() => setCompleted(false)}
                />
            ) : (
                <Button
                    title="Mark as complete"
                    onPress={() => setCompleted(true)}
                />
            )}

            <Button 
                title="Delete"
                onPress={deleteAssignment}
            />

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
                title="Reset"
                onPress={reset}
            />

            <Button 
                title="Save"
                onPress={saveAssignment}
            />

        </View>
    )
}
