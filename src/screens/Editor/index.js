import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Alert,
    TouchableWithoutFeedback,
    Keyboard,
} from "react-native";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { FontAwesome5 } from "@expo/vector-icons";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { CommonActions } from "@react-navigation/native";

const Editor = ({ navigation, route }) => {
    const { width: DEVICE_WIDTH } = useSafeAreaFrame();
    const [user, setUser] = useState(undefined);
    const [userData, setUserData] = useState(undefined);
    const [boardList, setBoardList] = useState([]);
    const [writer, setWriter] = useState("");
    const [published, setPublished] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");

    const id = route.params?.id;
    const owned = route.params?.owned;

    const authListener = () => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                console.log("user", user);
                setUser(user);
            } else {
                setUser(null);
            }
        });
    };

    const getUserName = async (user) => {
        console.log("user.uiduser.uid", user.uid);

        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setUserData(docSnap.data());
        } else {
            console.log("No Search Document");
        }
    };

    const handleCommentViewPress = () => {
        if (!id) return;
        navigation.navigate("COMMENT", { postId: id });
    };
    const handleAddPostPress = () => {
        const newTitle = title.trim();
        const newContent = content.trim();

        if (newTitle.length === 0 || newContent.length === 0) {
            return Alert.alert("제목과 내용을 입력하세요.");
        }
        const postsCollection = db.collection("posts");
        if (!id) {
            //new

            const post = {
                title: newTitle,
                content: newContent,
                displayName: userData.displayName,
                author: auth.currentUser.uid,
                createdAt: new Date(),
            };
            postsCollection.add(post);
        } else {
            //update
            postsCollection.doc(id).update({
                title: newTitle,
                content: newContent,
                displayName: userData.displayName,
                author: auth.currentUser.uid,
                createdAt: new Date(),
            });
        }

        navigation.dispatch(
            CommonActions.reset({
                routes: [{ name: "BOTTOM_TAB" }],
            })
        );
        navigation.navigate("BOTTOM_TAB");
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
        if (!id) return;

        const postsCollection = db.collection("posts");
        const doc = postsCollection.doc(id);
        doc.get().then((data) => {
            // console.log("data___", data.data().createdAt.toDate());
            const date = data.data().createdAt.toDate();
            const toStringDate = date.toISOString().slice(0, 10);

            setWriter(data.data().displayName);
            setPublished(toStringDate);
            setTitle(data.data().title);
            setContent(data.data().content);
        });
    }, [userData, id]);

    return (
        <SafeAreaView style={styles.container} edges={["left", "right"]}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            <TouchableOpacity
                activeOpacity={1}
                onPress={() => Keyboard.dismiss()}
            >
                <View style={styles.contentContainer}>
                    <View style={styles.editContainer}>
                        <>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 700,
                                        marginBottom: 10,
                                    }}
                                >
                                    제목 :
                                </Text>
                            </View>

                            <TextInput
                                style={styles.titleInput}
                                placeholder="제목을 입력하세요."
                                value={title}
                                onChangeText={(text) => setTitle(text)}
                                editable={owned === true ? true : false}
                            />

                            {owned !== true && (
                                <View>
                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 700,
                                                marginTop: 10,
                                                marginBottom: 10,
                                            }}
                                        >
                                            작성자 :
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.titleInput,
                                            {
                                                flex: 1,
                                                justifyContent: "center",
                                                width: "100%",
                                            },
                                        ]}
                                    >
                                        <Text style={{ fontSize: 16 }}>
                                            {writer}
                                        </Text>
                                    </View>

                                    <View>
                                        <Text
                                            style={{
                                                fontSize: 16,
                                                fontWeight: 700,
                                                marginTop: 10,
                                                marginBottom: 10,
                                            }}
                                        >
                                            작성일 :
                                        </Text>
                                    </View>

                                    <View
                                        style={[
                                            styles.titleInput,
                                            {
                                                flex: 1,
                                                justifyContent: "center",
                                                width: "100%",
                                                marginBottom: 70,
                                            },
                                        ]}
                                    >
                                        <Text>{published}</Text>
                                    </View>
                                </View>
                            )}

                            <View>
                                <Text
                                    style={{
                                        fontSize: 16,
                                        fontWeight: 700,
                                        marginTop: 15,
                                    }}
                                >
                                    내용 :
                                </Text>
                            </View>
                            <TextInput
                                style={styles.contentInput}
                                placeholder="내용을 입력하세요."
                                value={content}
                                multiline
                                onChangeText={(text) => setContent(text)}
                                numberOfLines={20}
                                returnKeyType={"default"}
                                editable={owned === true ? true : false}
                            />
                        </>
                    </View>
                    {id && (
                        <View
                            style={[
                                styles.floatingView,
                                { bottom: owned ? 80 : 30 },
                            ]}
                        >
                            <TouchableOpacity
                                style={styles.floatingBtn}
                                activeOpacity={0.8}
                                onPress={handleCommentViewPress}
                            >
                                <FontAwesome5
                                    name="comment-dots"
                                    size={24}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                    {owned && (
                        <TouchableOpacity
                            style={[styles.btn, { backgroundColor: "#377de6" }]}
                            activeOpacity={0.8}
                            onPress={handleAddPostPress}
                        >
                            <Text style={styles.btnText}>Complate!</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Editor;

const styles = StyleSheet.create({
    container: {
        position: "relative",
        paddingTop: 20,
        width: "100%",
        height: "100%",
        paddingHorizontal: 14,
        backgroundColor: "#fff",
    },
    contentContainer: {
        position: "relative",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
    },
    editContainer: {
        flex: 1,
        width: "100%",
    },
    //
    titleInput: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        minHeight: 60,
        fontSize: 16,
        color: "#000",
        borderWidth: 1,
        borderRadius: 10,
    },
    contentInput: {
        marginTop: 10,
        paddingVertical: 10,
        paddingHorizontal: 10,
        height: 200,
        fontSize: 16,
        color: "#000",
        textAlignVertical: "top",
        borderWidth: 1,
        borderRadius: 10,
    },

    //
    btn: {
        marginBottom: 10,
        width: "100%",
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
    floatingView: {
        position: "absolute",
        bottom: 80,
        right: 0,
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
