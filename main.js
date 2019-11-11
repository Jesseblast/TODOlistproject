/**
 * TODOlistproject - Jesse Könönen
 * main.js
 * 
 * 
 */

import React from "react";
import { createAppContainer } from "react-navigation";
import { createBottomTabNavigator } from "react-navigation-tabs";

import { AssignmentsTab } from "./AssignmentsTab";
import { CompletedAssignmentsTab } from "./CompletedAssignmentsTab";
import { SettingsTab } from "./SettingsTab";

const AppNavigator = createBottomTabNavigator({
    Assignments: {
        screen: AssignmentsTab,
        navigationOptions: {
            title: "Assignments"
        }
    },
    
    CompletedAssignments: {
        screen: CompletedAssignmentsTab,
        navigationOptions: {
            title: "Completed Assignments"
        }
    },

    Settings: {
        screen: SettingsTab,
        navigationOptions: {
            title: "Settings"
        }
    }
})

const AppContainer = createAppContainer(AppNavigator);

export const main = () => {
    return (<AppContainer />)
}
