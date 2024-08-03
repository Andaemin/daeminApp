import React, { useLayoutEffect, useState, useRef } from "react";
import { Keyboard, TextInput } from "react-native";
import { TouchableOpacity, StatusBar } from "react-native";
import { Alert } from "react-native";
import { Image } from "react-native";
import { Text, View, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EditCaps from "../../../assets/editCaps.png";
import CampuSync from "../../../assets/campuSync.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../../firebase";
import { CommonActions } from "@react-navigation/native";
import { doc, getDoc, setDoc } from "firebase/firestore";

const SignUp = ({ navigation }) => {
    const [id, setId] = useState("");
    const [email, setEmail] = useState("");
    const [pw, setPw] = useState("");
    const [pw2, setPw2] = useState("");

    const inputRefs = useRef([]);
    inputRefs[0] = useRef(null);
    inputRefs[1] = useRef(null);
    inputRefs[2] = useRef(null);
    inputRefs[3] = useRef(null);
    //
    const handleOnChangeText = (func, text) => {
        func(text);
    };

    const handleSignUp = async () => {
        //request sign
        // Alert.alert("request signup");
        // navigation.navigate("SIGN");

        await createUserWithEmailAndPassword(auth, email, pw)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("new_user____", user);
                const userRef = doc(db, "users", user.uid);
                setDoc(userRef, {
                    displayName: id,
                    email: email,
                    uid: user.uid,
                    createdAt: new Date().toUTCString(),
                });
            })
            .then(() => {
                navigation.dispatch(
                    CommonActions.reset({
                        routes: [{ name: "BOTTOM_TAB" }],
                    })
                );
                navigation.navigate("BOTTOM_TAB");
            })
            .catch((e) => {
                //error
                Alert.alert(e.message);
                inputRefs[0]?.current.focus();
            });
    };
    const handleCancel = () => {
        navigation.navigate("SIGN");
    };
    //
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

        inputRefs[0]?.current.focus();
    }, []);

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
                        placeholder="Username"
                        value={id}
                        onChangeText={(text) => handleOnChangeText(setId, text)}
                        returnKeyType={"next"}
                        onSubmitEditing={() => inputRefs[1].current?.focus()}
                    />
                    <TextInput
                        ref={inputRefs[1]}
                        style={[styles.input, { marginBottom: 10 }]}
                        placeholder="Email"
                        value={email}
                        onChangeText={(text) =>
                            handleOnChangeText(setEmail, text)
                        }
                        returnKeyType={"next"}
                        onSubmitEditing={() => inputRefs[2].current?.focus()}
                    />
                    <TextInput
                        ref={inputRefs[2]}
                        style={[styles.input, { marginBottom: 10 }]}
                        placeholder="Password"
                        value={pw}
                        onChangeText={(text) => handleOnChangeText(setPw, text)}
                        returnKeyType={"done"}
                        secureTextEntry
                        onSubmitEditing={() => inputRefs[3].current?.focus()}
                    />
                    <TextInput
                        ref={inputRefs[3]}
                        style={styles.input}
                        placeholder="Password Confirm"
                        value={pw2}
                        onChangeText={(text) =>
                            handleOnChangeText(setPw2, text)
                        }
                        returnKeyType={"done"}
                        secureTextEntry
                        onSubmitEditing={handleSignUp}
                    />
                </View>
                <View style={styles.signBtnView}>
                    <TouchableOpacity
                        style={[styles.signBtn, { marginBottom: 20 }]}
                        activeOpacity={0.8}
                        onPress={handleSignUp}
                    >
                        <Text style={styles.signBtnText}>Sign Up</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.signBtn}
                        activeOpacity={0.8}
                        onPress={handleCancel}
                    >
                        <Text style={styles.signBtnText}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SignUp;

const styles = StyleSheet.create({
    container: {
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
    signBtnView: { paddingTop: 40, alignItems: "center" },
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
        fontSize: 14,
        color: "#fff",
        textAlign: "center",
        flexWrap: "wrap",
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
