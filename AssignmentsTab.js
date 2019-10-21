/**
 * TODOlistproject - Jesse Könönen
 * AssignmentsTab.js
 * 
 * 
 */

import React from "react";
import { createStackNavigator } from "react-navigation-stack";
import { View, Text, Button } from "react-native";


const AssignmentsScreen = (props) => {


    return (
        <View>
            <Button 
                title="Add new assignment"
                onPress={() => props.navigation.navigate("NewAssignment")}
            />
            <Text>This is the assignments tab.</Text>
        </View>
    )
}

const NewAssignmentScreen = () => {


    return (
        <View>
            <Text>Here you create a new assignment.</Text>
        </View>
    )
}



export const AssignmentsTab = createStackNavigator(
    {
        Assignments: AssignmentsScreen,
        NewAssignment: NewAssignmentScreen
    },
    {
        initialRouteName: "Assignments"
    }
)

