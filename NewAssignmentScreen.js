/**
 * TODOlistproject
 * NewAssignmentScreen.js
 * 
 * 
 */

import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert, AsyncStorage } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { styles } from "./style";

export const NewAssignmentScreen = (props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [expiration, setExpiration] = useState("");
    const [location, setLocation] = useState("");
    const [locationData, setLocationData] = useState(undefined);
    const [coordinates, setCoordinates] = useState({lat: 60.201373, lng: 24.934041});

    // Set coordinates to first search result whenever they are fetched
    useEffect(() => { 
        if (locationData === undefined) return;
        setCoordinates({
            lat: locationData.results[0].locations[0].latLng.lat,
            lng: locationData.results[0].locations[0].latLng.lng
        })
    }, [locationData]);

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
            
            // Assignments list exists, this item is put after the last one
            if (items) {
                const restoredData = JSON.parse(items);
                var newKey = parseInt(restoredData[restoredData.length - 1].key);
                data.key = "" + (++newKey);

                const dataArray = [...restoredData, data];
                const stringifiedData = JSON.stringify(dataArray);
                await AsyncStorage.setItem("items", stringifiedData);
            }

            // Assignments list is empty, this is the first entry
            else {
                const dataArray = [data];
                const stringifiedData = JSON.stringify(dataArray);
                await AsyncStorage.setItem("items", stringifiedData);
            }

            console.log("New assignment saved <key: " + data.key 
            + ", completed: " + data.completed
            + ", title: " + data.title
            + ", description: " + data.description
            + ", expiration: " + data.expiration
            + ", location: " + data.location + ">");

        } catch (error) {
            Alert.alert("Error saving data! " + error);
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
            setLocationData(responseJson);
        })
        .catch((error) => {
            Alert.alert("Error! " + error);
        });

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
                title="Find address"
                onPress={() => findLocationFromAddress(location)}
            />

            <Button 
                title="Clear"
                onPress={clear}
            />

            <Button 
                title="Save"
                onPress={save}
            />

            {/* Test MapView */}
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