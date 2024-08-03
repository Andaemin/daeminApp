import React, { useLayoutEffect, useState, useRef, useEffect } from "react";
import { Keyboard, TextInput } from "react-native";
import { TouchableOpacity, StatusBar } from "react-native";
import { Alert } from "react-native";
import { Image } from "react-native";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EditCaps from "../../../assets/editCaps.png";
import CampuSync from "../../../assets/campuSync.png";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { CommonActions } from "@react-navigation/native";

const Sign = ({ navigation }) => {
    console.log("sign");
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [user, setUser] = useState(undefined);
    const [logined, setLogined] = useState(false);

    const inputRefs = useRef([]);
    inputRefs[0] = useRef(null);
    inputRefs[1] = useRef(null);
    //
    const handleOnChangeText = (func, text) => {
        func(text);
    };

    const handleSign = () => {
        //request sign
        if (id !== "" && pw !== "") {
            signInWithEmailAndPassword(auth, id, pw)
                .then((e) => {
                    setLogined(true);
                })
                .catch((err) => Alert.alert("Login error", err.message));
        } else {
            Alert.alert("Login error", "계정을 다시 입력해주세요.");
            inputRefs[0].current?.focus();
        }
    };

    const handleSignUp = () => {
        navigation.navigate("SIGN_UP");
    };
    //
    const authListener = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                // console.log("user", user);
                setUser(user);
                setLogined(true);
            } else {
                setUser(null);
                inputRefs[0].current?.focus();
            }
        });
    };
    //
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        __DEV__ && setId("chamchi0216@gmail.com");
        __DEV__ && setPw("!mhee7173");

        authListener();
    }, []);

    useEffect(() => {
        if (logined === true) {
            console.log("call");
            if (CommonActions) {
                navigation.dispatch(
                    CommonActions.reset({
                        routes: [{ name: "BOTTOM_TAB" }],
                    })
                );
                navigation.navigate("BOTTOM_TAB");
            }
        }
    }, [logined]);

    if (typeof user === "undefined") {
        return <View />;
    } else if (user === null) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="light-content"
                />
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => Keyboard.dismiss()}
                >
                    <View style={styles.logoView}>
                        <Image style={styles.logoImage} source={CampuSync} />
                    </View>
                    <View style={styles.inputView}>
                        <TextInput
                            ref={inputRefs[0]}
                            style={[styles.input, { marginBottom: 10 }]}
                            placeholder="수아양"
                            value={id}
                            onChangeText={(text) =>
                                handleOnChangeText(setId, text)
                            }
                            returnKeyType={"next"}
                            onSubmitEditing={() =>
                                inputRefs[1].current?.focus()
                            }
                        />
                        <TextInput
                            ref={inputRefs[1]}
                            style={styles.input}
                            placeholder="사랑행💘"
                            value={pw}
                            onChangeText={(text) =>
                                handleOnChangeText(setPw, text)
                            }
                            returnKeyType={"done"}
                            secureTextEntry
                            onSubmitEditing={handleSign}
                        />
                    </View>
                    <View style={styles.signBtnView}>
                        <TouchableOpacity
                            style={[styles.signBtn, { marginBottom: 10 }]}
                            activeOpacity={0.8}
                            onPress={handleSign}
                        >
                            <Text style={styles.signBtnText}>Login</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.signBtn}
                            activeOpacity={0.8}
                            onPress={handleSignUp}
                        >
                            <Text style={styles.signBtnText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.footerView}>
                        <View style={styles.footerTextView}>
                            <Text style={styles.footerText}>This app was created in 2023 by Daeminjo.</Text>
                            <Text style={styles.footerText}>Daemin-An, Hyeonbin-gil, Daehwan-Jeong, Gyumin-Nam, Jihyun-Kim</Text>
                            <Text style={styles.footerText}></Text>
                        </View>
                        <View style={styles.footerIconView}>
                            <Image
                                style={styles.footerIconImage}
                                source={EditCaps}
                            />
                        </View>
                    </View>
                </TouchableOpacity>
            </SafeAreaView>
        );
    } else {
        return <View />;
    }
};

export default Sign;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        flex: 1,
        paddingHorizontal: 14,
        backgroundColor: "#35598f",
    },
    logoView: {
        paddingVertical: 50,
        width: "100%",
        alignItems: "center",
    },
    logoImage: {
        width: 300,
        height: 90.4,
    },
    //
    inputView: {
        width: "100%",
        alignItems: "center",
    },
    input: {
        paddingVertical: 14,
        paddingHorizontal: 14,
        width: 300,
        fontSize: 14,
        color: "#000",
        // borderWidth: 1,
        // borderColor: "#000",
        borderRadius: 100,
        backgroundColor: "#fff",
    },
    //
    signBtnView: { paddingTop: 20, alignItems: "center" },
    signBtn: {
        paddingVertical: 14,
        paddingHorizontal: 14,
        width: 300,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        backgroundColor: "#377de6",
    },
    signBtnText: { fontSize: 14, color: "#fff" },
    //
    footerView: {
        paddingTop: 10,
        width: "100%",
        alignItems: "center",
    },
    footerTextView: {
        width: 200,
        alignItems: "center",
    },
    footerText: {
        fontSize: 10,
        color: "#ffffff",
        textAlign: "center",
        flexWrap: "wrap",
        marginTop: 10,
    },
    footerIconView: {
        marginTop: 10,
        width: 150,
    },
    footerIconImage: {
        width: 150,
        height: 150,
        resizeMode: "cover",
    },
});
