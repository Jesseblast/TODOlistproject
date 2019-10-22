/**
 * TODOlistproject - Jesse Könönen
 * AssignmentsTab.js
 * 
 * 
 */

import { createStackNavigator } from "react-navigation-stack";
import { AssignmentsScreen } from "./AssignmentsScreen";
import { NewAssignmentScreen } from "./NewAssignmentScreen";
import { EditAssignmentScreen } from "./EditAssignmentScreen";

export const AssignmentsTab = createStackNavigator(
    {
        Assignments: AssignmentsScreen,
        NewAssignment: NewAssignmentScreen,
        EditAssignment: EditAssignmentScreen
    },
    {
        initialRouteName: "Assignments"
    }
)
