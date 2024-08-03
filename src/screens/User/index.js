import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    StyleSheet,
    StatusBar,
    Image,
    TextInput,
    TouchableOpacity,
    Modal,
    Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EditCaps from "../../../assets/editCaps.png";
import { auth, db } from "../../../firebase";
import { CommonActions } from "@react-navigation/native";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";

const User = ({ navigation, route }) => {
    const [user, setUser] = useState(undefined);
    const [userData, setUserData] = useState(undefined);
    const [isVisible, setIsVisible] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    //
    const authListener = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("user", user);
                setUser(user);
            } else {
                setUser(null);
                if (CommonActions) {
                    navigation.dispatch(
                        CommonActions.reset({
                            routes: [{ name: "SIGN" }],
                        })
                    );
                    navigation.navigate("SIGN");
                }
            }
        });
    };

    const getUserName = async (user) => {
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setUserData(docSnap.data());
            // setUserInfo(docSnap.data());
            setIsVisible(false);
        } else {
            console.log("No Search Document");
        }
    };

    const handleLogOut = () => {
        auth.signOut();
    };

    const handleChangeUserNameBtnPress = () => {
        setIsVisible(true);
        setNewUsername(userData.displayName);
    };
    const handleChangeNewUserName = (text) => {
        setNewUsername(text);
    };
    const handleApplyUserName = async () => {
        const applyUsername = newUsername.trim();
        if (applyUsername.length === 0) {
            return Alert.alert("이름을 입력해주세요.");
        }

        //change username
        try {
            const docRef = doc(db, "users", user.uid);
            const docSnap = await updateDoc(docRef, {
                ...userData,
                displayName: applyUsername,
            });
            await getUserName(user);
        } catch (e) {
            console.log("e)", e);
            return Alert.alert("Username 변경중 오류가 발생했습니다.");
        }
    };
    //
    useEffect(() => {
        authListener();
    }, []);

    useEffect(() => {
        if (!user) return;
        getUserName(user);
    }, [user]);

    if (!userData) {
        return (
            <SafeAreaView style={styles.container}>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <Modal
                animationType="fade"
                transparent={true}
                visible={isVisible}
                onRequestClose={() => {
                    setIsVisible(false);
                }}
            >
                <TouchableOpacity
                    style={{
                        width: "100%",
                        height: "100%",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    activeOpacity={1}
                    onPress={() => setIsVisible(false)}
                >
                    <View style={styles.modalCenteredView}>
                        <TouchableOpacity activeOpacity={1}>
                            <View style={styles.modalContainer}>
                                <Text style={styles.modalTitle}>
                                    Change UserName
                                </Text>
                                <TextInput
                                    style={[styles.input, { marginBottom: 10 }]}
                                    placeholder={userData.displayName}
                                    value={newUsername}
                                    returnKeyType={"done"}
                                    onChangeText={handleChangeNewUserName}
                                />
                                <TouchableOpacity
                                    style={[
                                        styles.btn,
                                        {
                                            backgroundColor: "#35598f",
                                            width: "100%",
                                            marginBottom: 10,
                                        },
                                    ]}
                                    activeOpacity={0.8}
                                    onPress={handleApplyUserName}
                                >
                                    <Text style={styles.btnText}>
                                        Apply Username
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
            <View style={styles.logoView}>
                <Image style={styles.logoImage} source={EditCaps} />
            </View>
            <View style={styles.contentView}>
                <Text style={styles.label}>userName</Text>
                <Text style={styles.info}>{userData.displayName}</Text>
            </View>
            <View style={styles.contentView}>
                <Text style={styles.label}>Email</Text>
                <Text style={styles.info}>{userData.email}</Text>
            </View>
            <View style={styles.btnListView}>
                <TouchableOpacity
                    style={[
                        styles.btn,
                        { backgroundColor: "#35598f", marginBottom: 10 },
                    ]}
                    activeOpacity={0.8}
                    onPress={handleChangeUserNameBtnPress}
                >
                    <Text style={styles.btnText}>Change Username</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#377de6" }]}
                    activeOpacity={0.8}
                    onPress={handleLogOut}
                >
                    <Text style={styles.btnText}>LogOut</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default User;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 40,
        backgroundColor: "#fff",
    },
    logoView: {
        paddingVertical: 30,
        width: "100%",
        alignItems: "center",
    },
    logoImage: {
        width: 150,
        height: 150,
        backgroundColor: "#ececec",
        resizeMode: "cover",
        borderRadius: 12,
    },
    //
    contentView: {
        marginBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#000",
    },
    info: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#777",
    },
    //
    btnListView: {
        marginTop: 40,
        width: "100%",
        alignItems: "center",
    },
    btn: {
        width: 200,
        height: 50,
        paddingVertical: 10,
        paddingHorizontal: 14,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
    },
    btnText: {
        fontSize: 14,
        fontWeight: "bold",
        color: "#fff",
    },
    //
    modalCenteredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    modalContainer: {
        paddingVertical: 20,
        paddingHorizontal: 20,
        width: 300,
        backgroundColor: "#fff",
        alignItems: "center",
        borderWidth: 1,
        borderRadius: 10,
    },
    modalTitle: {
        marginBottom: 10,
        fontSize: 14,
        fontWeight: "bold",
        color: "#000",
    },
    input: {
        padding: 10,
        width: "100%",
        fontSize: 14,
        fontWeight: "bold",
        color: "#000",
        borderWidth: 1,
        borderRadius: 100,
    },
});
