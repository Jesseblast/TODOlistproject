/**
 * TODOlistproject - Jesse Könönen
 * EditAssignmentScreen.js
 * 
 * 
 */

import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert, AsyncStorage } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { styles } from "./style";

export const EditAssignmentScreen = (props) => {
    const [assignments, setAssignments] = useState(undefined);  // All assignments
    const [assignment, setAssignment] = useState(undefined);    // The assignment that's being edited
    const [assignmentIndex, setAssignmentIndex] = useState(0);  // And the index of the assignment that's being edited
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [address, setAddress] = useState("");
    const [addressData, setAddressData] = useState(undefined);
    const [coordinates, setCoordinates] = useState({lat: 60.201373, lng: 24.934041});
    const [completed, setCompleted] = useState(null);           // Is the assignment completed?

    useEffect(() => { loadAssignments(); }, [])
    useEffect(() => { findAssignment(props.navigation.getParam("key")) }, [assignments]);
    useEffect(() => { setValues(); }, [assignment]);

    // Set coordinates to first search result whenever they are fetched
    useEffect(() => { 
        if (addressData === undefined) return;
        setCoordinates({
            lat: addressData.results[0].locations[0].latLng.lat,
            lng: addressData.results[0].locations[0].latLng.lng
        })
    }, [addressData]);

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
        assignments[assignmentIndex].expirationDate = expirationDate;
        assignments[assignmentIndex].address = address;
        assignments[assignmentIndex].coordinates = coordinates;
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
        setExpirationDate(assignment.expirationDate);
        setAddress(assignment.address);
        setCoordinates(assignment.coordinates);
        setCompleted(assignment.completed);
    }

    // Clear all input
    const reset = () => {
        setTitle(assignment.title);
        setDescription(assignment.description);
        setExpirationDate(assignment.expirationDate);
        setAddress(assignment.address);
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

    // Find location using given address
    const findLocationFromAddress = (address) => {
        const consumerKey = "A8i208o8YWluaUeZ0iSYK8pAy7my8LKO";
        const url = "https://www.mapquestapi.com/geocoding/v1/address?key=" 
            + consumerKey + "&inFormat=kvp&outFormat=json&location=" 
            + address + "&thumbMaps=false";

        fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
            setAddressData(responseJson);
        })
        .catch((error) => {
            Alert.alert("Error! " + error);
        });
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

            {/* Set expiration date for new assignment */}
            <Text>Expiration date</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={(expirationDate) => setExpirationDate(expirationDate)}
                value={expirationDate}
            />

            {/* Set address for new assignment */}
            <Text>Address</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={(address) => setAddress(address)}
                onSubmitEditing={() => findLocationFromAddress(address)}
                value={address}
            />

            <Button 
                title="Reset"
                onPress={reset}
            />

            <Button 
                title="Save"
                onPress={saveAssignment}
            />

            {/* View address on map */}
            <MapView 
                style={{flex: 1}}
                initialRegion={{
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                    latitudeDelta: 0.0322,
                    longitudeDelta: 0.0221
                }}
                region={{
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                    latitudeDelta: 0.0322,
                    longitudeDelta: 0.0221
                }}>
                <Marker 
                    coordinate={{
                        latitude: coordinates.lat,
                        longitude: coordinates.lng
                    }}
                />
            </MapView>

        </View>
    )
}
