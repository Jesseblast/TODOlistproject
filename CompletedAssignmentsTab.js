/**
 * TODOlistproject - Jesse Könönen
 * CompletedAssignmentsTab.js
 * 
 * 
 */

import { createStackNavigator } from "react-navigation-stack";
import { CompletedAssignmentsScreen } from "./CompletedAssignmentsScreen";
import { EditAssignmentScreen } from "./EditAssignmentScreen";

export const CompletedAssignmentsTab = createStackNavigator(
    {
        CompletedAssignments: CompletedAssignmentsScreen,
        EditAssignment: EditAssignmentScreen
    },
    {
        initialRouteName: "CompletedAssignments"
    }
)
