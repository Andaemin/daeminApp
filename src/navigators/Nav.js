import React from "react";
import { Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Sign from "../screens/Sign";
import TodoList from "../screens/TodoList";
import BottomTabNav from "./BottomTabNav";
import SignUp from "../screens/SignUp";
import Editor from "../screens/Editor";
import Comment from "../screens/Comment";

const Stack = createNativeStackNavigator();

const Nav = ({ params }) => (
    <Stack.Navigator initialRouteName={"SIGN"}>
        <Stack.Screen
            name={"SIGN"}
            component={Sign}
            options={{
                animation: "slide_from_left",
                animationDuration: 200,
            }}
        />
        <Stack.Screen
            name={"SIGN_UP"}
            component={SignUp}
            options={{
                animation: "slide_from_right",
                animationDuration: 200,
            }}
        />
        <Stack.Screen
            name={"EDITOR"}
            component={Editor}
            options={{
                animation: "slide_from_right",
                animationDuration: 200,
                headerTitle: "CampuSync Board",
                headerTitleStyle: {
                    fontSize: 18,
                    color: "#000",
                },
            }}
        />
        <Stack.Screen
            name={"COMMENT"}
            component={Comment}
            options={{
                animation: "slide_from_right",
                animationDuration: 200,
                headerTitle: "CampuSync Comment",
                headerTitleStyle: {
                    fontSize: 18,
                    color: "#000",
                },
                headerBackTitleVisible: false,
            }}
        />
        <Stack.Screen
            name={"BOTTOM_TAB"}
            component={BottomTabNav}
            options={{
                headerShown: false,
            }}
        />
    </Stack.Navigator>
);

export default Nav;
