import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Platform,
} from "react-native";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";

const Board = ({ navigation }) => {
    const { width: DEVICE_WIDTH } = useSafeAreaFrame();
    const [user, setUser] = useState(undefined);
    const [userData, setUserData] = useState(undefined);
    const [boardList, setBoardList] = useState([]);

    const renderItem = ({ item, index }) => {
        const handleEditPress = () => {
            if (!user) return;
            // if (user.uid === item.author)
            console.log("user.uid === item.author", user.uid === item.author);
            navigation.navigate({
                name: "EDITOR",
                params: { id: item.id, owned: user.uid === item.author },
            });
        };
        const handleDelPostPress = () => {
            if (!user) return;
            if (user.uid === item.author) {
                const postsCollection = db.collection("posts");
                postsCollection.doc(item.id).delete();
            }
        };

        return (
            <View style={styles.itemView}>
                <TouchableOpacity
                    style={styles.postItemBtn}
                    activeOpacity={0.8}
                    onPress={handleEditPress}
                >
                    <Text
                        style={styles.titleText}
                        numberOfLines={1}
                        ellipsizeMode={"tail"}
                    >
                        {item.title}
                    </Text>
                    <View style={styles.contentView}>
                        <Text
                            style={styles.contentText}
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                        >
                            {item.content}
                        </Text>
                    </View>
                </TouchableOpacity>
                {user?.uid === item.author && (
                    <View style={styles.delBtnView}>
                        <TouchableOpacity
                            style={styles.delBtn}
                            onPress={handleDelPostPress}
                        >
                            <Feather name="trash-2" size={24} color="white" />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    };
    //
    const authListener = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("user", user);
                setUser(user);
            } else {
                setUser(null);

                // navigation.dispatch(
                //     CommonActions.reset({
                //         routes: [{ name: "SIGN" }],
                //     })
                // );
                // navigation.navigate("SIGN");
            }
        });
    };

    const getUserName = async (user) => {
        if (!user) return;
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setUserData(docSnap.data());
        } else {
            console.log("No Search Document");
        }
    };

    const handleEditPress = () => {
        navigation.navigate("EDITOR", { owned: true });
    };
    //
    useEffect(() => {
        authListener();
    }, []);

    useEffect(() => {
        if (!user) return;
        getUserName(user);
    }, [user]);

    useEffect(() => {
        if (!userData) return;

        const postsCollection = db.collection("posts");
        const query = postsCollection.orderBy("createdAt", "desc");
        query.onSnapshot((snapshot) => {
            setBoardList(
                snapshot.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() };
                })
            );
            // setPosts(snapshot.docs.map((doc) => doc.data()));
            // console.log("posts", posts);
        });
    }, [userData]);

    return (
        <SafeAreaView style={styles.container} edges={["left", "right"]}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />

            <FlatList
                data={boardList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
            <View style={styles.floatingView}>
                <TouchableOpacity
                    style={styles.floatingBtn}
                    activeOpacity={0.8}
                    onPress={handleEditPress}
                >
                    <Feather name="edit" size={24} color="white" />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Board;

const styles = StyleSheet.create({
    container: {
        position: "relative",
        paddingTop: 20,
        width: "100%",
        height: "100%",
        paddingHorizontal: 14,
        backgroundColor: "#fff",
    },
    //
    itemView: {
        marginBottom: 10,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        borderRadius: 10,
        backgroundColor: "#35598f",
        overflow: "hidden",
    },
    postItemBtn: {
        paddingHorizontal: 14,
        paddingVertical: 20,
        flex: 1,
    },
    //
    titleText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    contentView: {
        marginTop: 4,
    },
    contentText: {
        fontSize: 14,
        color: "#fff",
    },
    delBtnView: {
        width: 60,
        height: "100%",
    },
    delBtn: {
        flex: 1,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    delBtnText: {
        fontSize: 14,
        color: "#fff",
    },
    //
    floatingView: {
        position: "absolute",
        bottom: Platform.OS === "android" ? 80 : 100,
        right: 20,
    },
    floatingBtn: {
        width: 70,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        backgroundColor: "#377de6",
    },
});
