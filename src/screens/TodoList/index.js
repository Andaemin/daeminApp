import React, { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { ScrollView } from "react-native";
import { TouchableOpacity } from "react-native";
import { TextInput } from "react-native";
import { Text, View, StyleSheet, StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaFrame } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";

const TodoList = ({ navigation }) => {
    const { width: DEVICE_WIDTH } = useSafeAreaFrame();
    const [newTodo, setNewTodo] = useState("");
    const [todoList, setTodoList] = useState([
        // { key: "test1", value: "todo test" },
        // { key: "test2", value: "todo test2" },
    ]);

    const itemWidth = DEVICE_WIDTH - 14 * 4;

    const handleChangeNewTodoText = (text) => {
        setNewTodo(text);
    };

    const handleAddTodoPress = () => {
        const newContent = newTodo.trim();
        if (newContent.length === 0) return;

        // add
        setTodoList([
            { key: new Date().toISOString(), value: newContent },
            ...todoList,
        ]);
        setNewTodo("");
    };
    //
    const handleChangeItemText = (index, text) => {
        setTodoList((t) => {
            let clone = [...t];
            clone[index].value = text;
            return clone;
        });
    };
    const handleCheckTodoPress = (data) => {
        let dataIdx = -1;
        let currTodo = todoList.filter((item, idx) => {
            const equal = item.key === data.key;
            if (equal) dataIdx = idx;
            return item.key === data.key;
        });

        if (currTodo.length > 0) {
            let newData = currTodo[0];
            if (
                typeof newData.checked === "undefined" ||
                newData.checked === false
            ) {
                newData.checked = true;
                setTodoList((t) => {
                    let clone = [...t];
                    clone.splice(dataIdx, 1, newData);
                    return clone;
                });
            }
        }
    };

    const handleDelTodoPress = (index) => {
        setTodoList((t) => {
            let clone = [...t];
            clone.splice(index, 1);
            return clone;
        });
    };

    const renderItem = ({ item, index }) => {
        return (
            <View style={styles.itemView}>
                <View
                    style={[
                        styles.todoInputView,
                        {
                            backgroundColor:
                                item.checked === true ? "#ccc" : "#35598f",
                        },
                    ]}
                >
                    <ScrollView
                        style={{ width: itemWidth }}
                        horizontal
                        pagingEnabled
                        snapToAlignment="end"
                        showsHorizontalScrollIndicator={false}
                        scrollEnabled={item.checked}
                    >
                        <View
                            style={[styles.displayView, { width: itemWidth }]}
                        >
                            <View style={styles.leftContentView}>
                                <TouchableOpacity
                                    style={styles.checkBtn}
                                    activeOpacity={0.8}
                                    onPress={() => handleCheckTodoPress(item)}
                                >
                                    {item.checked === true && <Text>V</Text>}
                                </TouchableOpacity>
                                <TextInput
                                    editable={item.checked ? false : true}
                                    selectTextOnFocus={false}
                                    style={[
                                        styles.todoInput,
                                        {
                                            textDecorationLine:
                                                item.checked === true
                                                    ? "line-through"
                                                    : "none",
                                        },
                                    ]}
                                    value={item.value}
                                    onChangeText={(text) =>
                                        handleChangeItemText(index, text)
                                    }
                                    returnKeyType={"done"}
                                />
                            </View>
                            {/* <View style={{ justifyContent: "center" }}>
                                <TouchableOpacity style={styles.moveBtn} activeOpacity={0.8}></TouchableOpacity>
                            </View> */}
                        </View>
                        <TouchableOpacity
                            style={styles.delBtn}
                            activeOpacity={0.8}
                            onPress={() => handleDelTodoPress(index)}
                        >
                            <Feather name="trash-2" size={24} color="white" />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        );
    };
    //
    useEffect(() => {}, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="light-content"
            />
            <View style={styles.addTodoInputView}>
                <TextInput
                    style={styles.input}
                    placeholder="여기에 입력해주세요"
                    placeholderTextColor={"rgba(255,255,255,0.8)"}
                    value={newTodo}
                    onChangeText={handleChangeNewTodoText}
                    returnKeyType={"done"}
                    onSubmitEditing={handleAddTodoPress}
                />
            </View>
            <FlatList
                data={todoList}
                keyExtractor={(item, index) => item.key}
                renderItem={renderItem}
            />
        </SafeAreaView>
    );
};

export default TodoList;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 14,
        backgroundColor: "#fff",
    },
    //
    addTodoInputView: {
        paddingBottom: 10,
        paddingHorizontal: 14,
        width: "100%",
    },
    input: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        width: "100%",
        height: 60,
        fontSize: 14,
        color: "#fff",
        borderRadius: 20,
        backgroundColor: "#35598f",
    },
    //
    itemView: {
        paddingHorizontal: 14,
        paddingVertical: 4,
        width: "100%",
        overflow: "hidden",
    },
    todoInputView: {
        // paddingHorizontal: 14,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        borderRadius: 20,
        backgroundColor: "#35598f",
        borderWidth: 0,
        overflow: "hidden",
    },
    displayView: {
        paddingHorizontal: 14,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    leftContentView: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
    },
    checkBtn: {
        width: 30,
        height: 30,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 100,
        borderWidth: 0,
        backgroundColor: "#fff",
    },
    todoInput: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        height: 60,
        fontSize: 14,
        color: "#fff",
        backgroundColor: "transparent",
    },
    moveBtn: {
        width: 30,
        height: 10,
        borderRadius: 100,
        borderWidth: 0,
        backgroundColor: "#ccc",
    },
    delBtn: {
        width: 60,
        height: 60,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "red",
    },
});
