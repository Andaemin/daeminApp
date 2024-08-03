import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text, View, StyleSheet, Image, Platform } from "react-native";
import TodoList from "../screens/TodoList";
import Weather from "../screens/Weather";
import Board from "../screens/Board";
import User from "../screens/User";
import {
    FontAwesome,
    Entypo,
    MaterialCommunityIcons,
    AntDesign,
} from "@expo/vector-icons";
import EditCaps from "../../assets/editCaps.png";

const Tab = createBottomTabNavigator();

const BottomTabNav = ({ params }) => {
    const NavHeight = Platform.OS === "android" ? 100 : 120;

    return (
        <Tab.Navigator
            initialRouteName="BOARD"
            backBehavior="history"
            screenOptions={({ route }) => {
                return {
                    tabBarStyle: {
                        position: "absolute",
                        backgroundColor: "#35598f",
                        paddingTop: 4,
                        paddingBottom: Platform.OS === "android" ? 6 : 26,
                        height: Platform.OS === "android" ? 60 : 90,
                    },
                    tabBarIcon: ({ focused, color, size }) => {
                        switch (route.name) {
                            case "BOARD":
                                return (
                                    <MaterialCommunityIcons
                                        name="clipboard-text-outline"
                                        size={24}
                                        color="white"
                                    />
                                );
                            case "WEATHER":
                                return (
                                    <Entypo
                                        name="icloud"
                                        size={24}
                                        color="white"
                                    />
                                );
                            case "TODOLIST":
                                return (
                                    <FontAwesome
                                        name="list-alt"
                                        size={24}
                                        color="white"
                                    />
                                );
                            case "USER":
                                return (
                                    <AntDesign
                                        name="user"
                                        size={24}
                                        color="white"
                                    />
                                );
                            default:
                                return null;
                        }
                    },
                    tabBarLabel: ({ tintColor, focused, item }) => {
                        return focused ? (
                            <Text style={styles.tabBarLabelStyle}>
                                {route.name}
                            </Text>
                        ) : (
                            <Text style={styles.tabBarInActiveLabelStyle}>
                                {route.name}
                            </Text>
                        );
                    },
                    tabBarActiveTintColor: "#fff",
                    tabBarInActiveTintColor: "rgba(255,255,255,0.8)",
                };
            }}
        >
            <Tab.Screen
                name="BOARD"
                component={Board}
                options={{
                    title: "Board",
                    headerTitle: "MAIN",
                    headerTitleStyle: {
                        fontSize: 14,
                        textAlign: "center",
                        color: "#fff",
                    },

                    headerLeft: () => (
                        <Image
                            style={{ marginLeft: 10, width: 50, height: 50 }}
                            source={EditCaps}
                            width={20}
                            height={20}
                            resizeMode={"cover"}
                        />
                    ),
                    headerTitleAlign: "center",
                    headerStyle: {
                        height: NavHeight,
                        backgroundColor: "#35598f",
                    },
                }}
            />

            <Tab.Screen
                name="WEATHER"
                component={Weather}
                options={{
                    title: "Weather",
                    headerTitle: "WEATHER",
                    headerTitleStyle: {
                        fontSize: 14,
                        textAlign: "center",
                        color: "#fff",
                    },
                    headerLeft: () => (
                        <Image
                            style={{ marginLeft: 10, width: 50, height: 50 }}
                            source={EditCaps}
                            width={20}
                            height={20}
                            resizeMode={"cover"}
                        />
                    ),
                    headerTitleAlign: "center",
                    headerStyle: {
                        height: NavHeight,
                        backgroundColor: "#35598f",
                    },
                }}
            />
            <Tab.Screen
                name="TODOLIST"
                component={TodoList}
                options={{
                    title: "Todo",
                    headerTitle: "TODO LIST",
                    headerTitleStyle: {
                        fontSize: 14,
                        textAlign: "center",
                        color: "#fff",
                    },
                    headerLeft: () => (
                        <Image
                            style={{ marginLeft: 10, width: 50, height: 50 }}
                            source={EditCaps}
                            width={20}
                            height={20}
                            resizeMode={"cover"}
                        />
                    ),
                    headerTitleAlign: "center",
                    headerStyle: {
                        height: NavHeight,
                        backgroundColor: "#35598f",
                    },
                }}
            />
            <Tab.Screen
                name="USER"
                component={User}
                options={{
                    title: "User",
                    headerTitle: "USER DATA",
                    headerTitleStyle: {
                        fontSize: 14,
                        textAlign: "center",
                        color: "#fff",
                    },
                    headerLeft: () => (
                        <Image
                            style={{ marginLeft: 10, width: 50, height: 50 }}
                            source={EditCaps}
                            width={20}
                            height={20}
                            resizeMode={"cover"}
                        />
                    ),
                    headerTitleAlign: "center",
                    headerStyle: {
                        height: NavHeight,
                        backgroundColor: "#35598f",
                    },
                }}
            />
        </Tab.Navigator>
    );
};

export default BottomTabNav;

const styles = StyleSheet.create({
    tabBarLabelStyle: {
        fontSize: 12,
        color: "#fff",
        justifyContent: 'center',
    },
    tabBarInActiveLabelStyle: {
        fontSize: 12,
        color: "rgba(255,255,255,0.5)",
    },
});
