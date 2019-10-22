/**
 * TODOlistproject - Jesse Könönen
 * SettingsTab.js
 * 
 * 
 */

import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { View, Text } from "react-native";
import { styles } from "./style";

const SettingsScreen = () => {


    return (
        <View style={styles.viewContainer}>
            <Text>This is the settings tab.</Text>
        </View>
    )
}



/* ******************************************************* */
export const SettingsTab = createStackNavigator(
    {
        Settings: SettingsScreen
    },
    {
        initialRouteName: "Settings"
    }
)
