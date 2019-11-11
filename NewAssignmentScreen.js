/**
 * TODOlistproject
 * NewAssignmentScreen.js
 * 
 * 
 */

import React, { useState, useEffect } from "react";
import { View, Text, Button, TextInput, Alert, AsyncStorage } from "react-native";
import MapView, { Marker } from "react-native-maps";

/**
 * Pointlessly hard to get datepicker working although it is possible.
 * React native isn't supporting this well enough and they are
 * also dropping the support for the previous implementation
 *  => https://facebook.github.io/react-native/docs/datepickerios
 * 
 * This either isn't working on current native version that I am using
 *  => https://www.npmjs.com/package/react-native-datepicker
 * 
 * So, the expiration date will be just a string.
 */
import DateTimePicker from "@react-native-community/datetimepicker";        // Experimental
import { styles } from "./style";

export const NewAssignmentScreen = (props) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [expirationDate, setExpirationDate] = useState("");
    const [address, setAddress] = useState("");
    const [addressData, setAddressData] = useState(undefined);
    const [coordinates, setCoordinates] = useState({lat: 60.201373, lng: 24.934041});

    // Set coordinates to first search result whenever they are fetched
    useEffect(() => { 
        if (addressData === undefined) return;
        setCoordinates({
            lat: addressData.results[0].locations[0].latLng.lat,
            lng: addressData.results[0].locations[0].latLng.lng
        })
    }, [addressData]);

    // Clear all input
    const clear = () => {
        setTitle("");
        setDescription("");
        setExpirationDate("");
        setAddress("");
    }

    // Save the new assignment
    const save = async () => {

        // Data structure to be saved
        var data = {
            key: "0",
            completed: false,                // Is this assignment completed?
            title: title,
            description: description,
            expirationDate: expirationDate,
            address: address,
            coordinates: coordinates
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
            + ", expirationDate: " + data.expirationDate
            + ", address: " + data.address + ">");

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
            setAddressData(responseJson);
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

            {/* Set expiration date for new assignment */}
            <Text>Expiration date</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={(expirationDate) => setExpirationDate(expirationDate)}
                value={expirationDate}
            />
            

            {/* It's a hassle to get this working so forget it */}
            {/*
            <Text>Expiration date</Text>
            <DateTimePicker 
                mode="date"
                value={expirationDate}
                onChange={(expirationDate) => {setExpirationDate(expirationDate)}}
            />
            */}

            {/* Set address for new assignment */}
            <Text>Address</Text>
            <TextInput 
                style={styles.textInput}
                onChangeText={(address) => setAddress(address)}
                onSubmitEditing={() => findLocationFromAddress(address)}
                value={address}
            />

            <Button 
                title="Clear"
                onPress={clear}
            />

            <Button 
                title="Save"
                onPress={save}
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