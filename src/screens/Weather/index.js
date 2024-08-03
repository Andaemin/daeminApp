import React, { useState, useEffect } from "react";
import {
    Platform,
    RefreshControl,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    View,
} from "react-native";
import {
    SafeAreaView,
    useSafeAreaFrame,
    useSafeAreaInsets,
} from "react-native-safe-area-context";
import * as Device from "expo-device";
import * as Location from "expo-location";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { useHeaderHeight } from "@react-navigation/elements";

const stdData = {
    Thunderstorm: { color: "#bcc5f7", title: "흐림" },
    Drizzle: { color: "#c8dae3", title: "이슬비" },
    Rain: { color: "#5f7d8c", title: "비" },
    Snow: { color: "#c1e3f5", title: "눈" },
    Dust: { color: "#bcc5f7", title: "먼지" },
    Smoke: { color: "#e0dff5", title: "흐림" },
    Mist: { color: "#bcc5f7", title: "안개" },
    Fog: { color: "#bcc5f7", title: "안개" },
    Squall: { color: "#3c5b6b", title: "돌풍" },
    Clouds: { color: "#b4d0d1", title: "구름낌" },
    Haze: { color: "#bcc5f7", title: "안개" },
    Sand: { color: "#bcc5f7", title: "-" },
    Ash: { color: "#bcc5f7", title: "-" },
    Tornado: { color: "#bcc5f7", title: "-" },
    Clear: { color: "#3c5b6b", title: "맑음" },
};

const Weather = ({ params }) => {
    const [location, setLocation] = useState(undefined);
    const [errorMsg, setErrorMsg] = useState(undefined);
    const [displayData, setDisplayData] = useState(undefined);
    const [loading, setLoading] = useState(false);

    const weather = displayData?.weather[0]?.main;
    const { height: DEVICE_HEIGHT } = useSafeAreaFrame();
    const { top, bottom } = useSafeAreaInsets();
    const navHeight = useHeaderHeight();
    const viewHeight =
        DEVICE_HEIGHT - bottom - navHeight - StatusBar.currentHeight ?? 0;

    const checkGrant = async () => {
        if (Platform.OS === "android" && !Device.isDevice) {
            setErrorMsg(
                "Oops, this will not work on Snack in an Android Emulator. Try it on your device!"
            );
            return { grant: false, location: undefined };
        }
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
            setErrorMsg("Permission to access location was denied");
            return { grant: false, location: undefined };
        }
        let location = await Location.getCurrentPositionAsync({});

        setLocation(location);
        //{"coords": {"accuracy": 100, "altitude": 80.80000305175781, "altitudeAccuracy": 100, "heading": 0, "latitude": 37.401124, "longitude": 126.9662513, "speed": 0}, "mocked": false, "timestamp": 1698303663995}
        setErrorMsg(undefined);

        return { grant: true, location };
    };

    const initialize = async () => {
        const { grant, location } = await checkGrant();
        if (grant) {
            setLoading(true);

            fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${location.coords.latitude}&lon=${location.coords.longitude}&appid=d51a759cf490e4582f25d00fead8511d`
            )
                .then((response) => response.json())
                .then((data) => {
                    if (data.cod === "400") {
                        return setErrorMsg(data.message);
                    }
                    console.log("data", data);
                    // let dummy = {
                    //     base: "stations",
                    //     clouds: { all: 12 },
                    //     cod: 200,
                    //     coord: { lat: 37.5283, lon: 126.9294 },
                    //     dt: 1698303964,
                    //     id: 1837055,
                    //     main: { feels_like: 292.71, grnd_level: 1011, humidity: 62, pressure: 1013, sea_level: 1013, temp: 293.05, temp_max: 293.09, temp_min: 293.05 },
                    //     name: "Yongsan",
                    //     sys: { country: "KR", id: 5509, sunrise: 1698270608, sunset: 1698309736, type: 1 },
                    //     timezone: 32400,
                    //     visibility: 10000,
                    //     weather: [{ description: "few clouds", icon: "02d", id: 801, main: "Clouds" }],
                    //     wind: { deg: 230, gust: 6.55, speed: 4.77 },
                    // };

                    setDisplayData(data);
                    setLoading(false);
                })
                .catch((error) => {
                    console.error(error);
                    setLoading(false);
                });
        }
    };
    //
    useEffect(() => {
        initialize();
    }, []);
    console.log("displayData____", displayData);
    return (
        <SafeAreaView
            style={[
                styles.container,
                {
                    backgroundColor: stdData[weather]
                        ? stdData[weather].color
                        : "#fff",
                },
            ]}
        >
            <StatusBar
                translucent
                backgroundColor="transparent"
                barStyle="dark-content"
            />
            {displayData && (
                <ScrollView
                    style={[
                        styles.contentContainer,
                        {
                            height: viewHeight,
                        },
                    ]}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={initialize}
                        />
                    }
                    scrollEnabled={Platform.OS === "android" ? false : true}
                    showsVerticalScrollIndicator={false}
                >
                    <View
                        style={{
                            width: "100%",
                            height: viewHeight,
                        }}
                    >
                        <View style={styles.locationView}>
                            <Text style={styles.locationText}>
                                {displayData.name}
                            </Text>
                        </View>
                        <View style={styles.contentView}>
                            {[
                                "Haze",
                                "Dust",
                                "Smoke",
                                "Mist",
                                "Fog",
                                "Clouds",
                            ].indexOf(weather) !== -1 ? (
                                <MaterialCommunityIcons
                                    name="weather-fog"
                                    size={80}
                                    color="white"
                                />
                            ) : ["Snow"].indexOf(weather) !== -1 ? (
                                <Feather
                                    name="weather-hail"
                                    size={80}
                                    color="white"
                                />
                            ) : ["Rain", "Drizzle"].indexOf(weather) !== -1 ? (
                                <MaterialCommunityIcons
                                    name="weather-pouring"
                                    size={80}
                                    color="white"
                                />
                            ) : ["Clear"].indexOf(weather) !== -1 ? (
                                <Feather name="sun" size={80} color="white" />
                            ) : (
                                <MaterialCommunityIcons
                                    name="weather-pouring"
                                    size={80}
                                    color="white"
                                />
                            )}
                            <Text style={styles.tempText}>
                                {Math.floor(
                                    (displayData.main?.temp ?? 0) - 273.75
                                )}
                            </Text>
                            <Text style={styles.weatherText}>
                                {weather ? stdData[weather]?.title ?? "-" : "-"}
                            </Text>
                        </View>
                    </View>
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default Weather;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 14,
        backgroundColor: "#fff",
        height: "100%",
    },
    contentContainer: {
        // flex: 1,
        width: "100%",
        height: "100%",
        paddingBottom: 50,
    },
    //
    locationView: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        // backgroundColor: "#35598f",
    },
    locationText: {
        fontSize: 30,
        color: "#fff",
    },
    contentView: {
        position: "absolute",
        top: 0,
        left: 0,
        flex: 1,
        width: "100%",
        height: "100%",
        paddingBottom: 50,
        alignItems: "center",
        justifyContent: "center",
    },
    tempText: {
        fontSize: 120,
        color: "#fff",
    },
    weatherText: {
        fontSize: 30,
        color: "#fff",
    },
});
