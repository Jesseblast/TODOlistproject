/**
 * TODOlistproject - Jesse Könönen
 * CompletedAssignmentsTab.js
 * 
 * 
 */

import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { View, Text } from "react-native";
import { styles } from "./style";

const CompletedAssignmentsScreen = () => {


    return (
        <View style={styles.viewContainer}>
            <Text>This is the completed assignments tab.</Text>
        </View>
    )
}


/* ******************************************************* */
export const CompletedAssignmentsTab = createStackNavigator(
    {
        CompletedAssignments: CompletedAssignmentsScreen
    },
    {
        initialRouteName: "CompletedAssignments"
    }
)
