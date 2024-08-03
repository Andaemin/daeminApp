import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import {
    Text,
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Alert,
    TextInput,
} from "react-native";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { auth, db } from "../../../firebase";
import { doc, getDoc } from "firebase/firestore";
import { Modal } from "react-native";

const Comment = ({ navigation, route }) => {
    const [user, setUser] = useState(undefined);
    const [userData, setUserData] = useState(undefined);
    const [commentList, setCommentList] = useState([]);
    const [isVisible, setIsVisible] = useState(false);
    const [newComment, setNewComment] = useState("");

    const postId = route.params.postId;

    const renderItem = ({ item, index }) => {
        console.log("item___", item);
        const handleDelCommentPress = () => {
            if (user.uid === item.author) {
                const commentsCollection = db.collection("comments");
                commentsCollection.doc(item.id).delete();
            }
        };

        return (
            <View style={styles.itemView}>
                <View style={styles.postItemView}>
                    <View style={styles.contentView}>
                        <Text
                            style={styles.userText}
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                        >
                            {item.displayName}
                        </Text>
                        <Text
                            style={styles.contentText}
                            numberOfLines={1}
                            ellipsizeMode={"tail"}
                        >
                            {item.comment}
                        </Text>
                    </View>
                </View>
                {user.uid === item.author && (
                    <View style={styles.delBtnView}>
                        <TouchableOpacity
                            style={styles.delBtn}
                            onPress={handleDelCommentPress}
                        >
                            <Feather name="trash-2" size={24} color="black" />
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

    const handleAddCommentPress = () => {
        setIsVisible(true);
    };

    const handleCreateCommentPress = () => {
        // apply comment
        const commentText = newComment.trim();
        if (commentText.length === 0) {
            return Alert.alert("내용을 적어주세요.");
        }
        const commentsCollection = db.collection("comments");
        const commentData = {
            comment: newComment,
            displayName: userData.displayName,
            author: user.uid,
            postID: postId,
            createdAt: new Date(),
        };
        commentsCollection.add(commentData);

        setNewComment("");
        setIsVisible(false);
        loadCommentList();
    };

    const loadCommentList = (postId) => {
        if (!postId) return;

        const commentsCollection = db.collection("comments");
        const query = commentsCollection.where("postID", "==", postId);

        query.onSnapshot((snapshot) => {
            console.log("snapshot", snapshot);
            setCommentList(
                snapshot.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() };
                })
            );
        });
    };

    const handleChangeCommentText = (text) => {
        setNewComment(text);
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
        console.log("userData", userData);
        if (!userData) return;

        loadCommentList(postId);
    }, [userData]);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            {userData && (
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
                        onPress={() => {
                            setIsVisible(false);
                            setNewComment("");
                        }}
                    >
                        <View style={styles.modalCenteredView}>
                            <TouchableOpacity activeOpacity={1}>
                                <View style={styles.modalContainer}>
                                    <TextInput
                                        style={[
                                            styles.input,
                                            { marginBottom: 10 },
                                        ]}
                                        placeholder={"Comment..."}
                                        value={newComment}
                                        returnKeyType={"done"}
                                        onChangeText={handleChangeCommentText}
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
                                        onPress={handleCreateCommentPress}
                                    >
                                        <Text style={styles.btnText}>
                                            댓글등록
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </TouchableOpacity>
                        </View>
                    </TouchableOpacity>
                </Modal>
            )}

            <FlatList
                data={commentList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                showsVerticalScrollIndicator={false}
            />
            <View style={styles.floatingView}>
                <TouchableOpacity
                    style={[styles.btn, { backgroundColor: "#377de6" }]}
                    activeOpacity={0.8}
                    onPress={handleAddCommentPress}
                >
                    <Text style={styles.btnText}>댓글쓰기</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default Comment;

const styles = StyleSheet.create({
    container: {
        position: "relative",
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
        // backgroundColor: "#35598f",
        overflow: "hidden",
    },
    postItemView: {
        paddingHorizontal: 14,
        paddingVertical: 20,
        flex: 1,
    },
    //
    userText: {
        fontSize: 15,
        fontWeight: "bold",
        color: "#000",
    },
    contentView: {
        marginTop: 4,
    },
    contentText: {
        fontSize: 14,
        color: "#000",
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
