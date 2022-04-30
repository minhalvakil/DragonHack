import React, { useState, useEffect } from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground
} from "react-native";
import HyperLink from "../components/HyperLink";
import AsyncStorage from '@react-native-async-storage/async-storage';
import requestLocation from "../helpers/requestLocation";
import FIPS from "../FIPS/FIPS.json";

const MainScreen = ({ navigation }) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [settings, setSettings] = useState(null);
    const [fipsCode, setFipsCode] = useState(null);

    const onResetSettings = () => {
        AsyncStorage.removeItem('settings')
        .then(() => {
            navigation.navigate("Setup");
        })
        .catch(error => {
            Alert.alert("An error occured", error.message);
        });
    };

    useEffect(() => {
        AsyncStorage.getItem('settings')
        .then(value => {
            setSettings(JSON.parse(value));
            
            // Get the user's location
            requestLocation()
            .then(location => {
                const stateFIPS = FIPS[location.region];
                stateFIPS.forEach(item => {
                    if(item[location.city] !== undefined){
                        setFipsCode(item[location.city]);
                    }
                });
            })
            .catch(error => {
                setErrorMessage(error.message);
            });
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.header}>
                    {
                        settings ? (
                            `${settings.mandateOnly ? "Do you need to" : "Should you"} wear a mask today?`
                        ) : "Loading"
                    }
                </Text>
                <Text style={styles.header}>Fauci says</Text>
                <View style={styles.fauci}>
                    <Image
                        source={require(`../../assets/${'happy'}-fauci.png`)}
                        style={styles.fauciImage}
                    />
                    <ImageBackground
                        source={require(`../../assets/speech-bubble.png`)}
                        resizeMode="contain"
                        style={styles.speechBubble}
                    >
                        <Text style={styles.answer}>
                            {fipsCode || "..."}
                        </Text>
                    </ImageBackground>
                </View>
            </View>
            <View>
                <HyperLink
                    onPress={onResetSettings}
                    style={styles.link}
                >
                    More Info
                </HyperLink>
                <HyperLink
                    onPress={onResetSettings}
                    style={styles.link}
                >
                    Reset settings
                </HyperLink>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 20,
        flex: 1,
        justifyContent: "space-between",
    },
    header: {
        fontSize: 28,
        opacity: 0.5,
        textAlign: "center",
        marginTop: 50
    },
    fauci: {
        marginTop: 50,
        flexDirection: "row",
    },
    fauciImage: {
        borderRadius: 999,
        marginTop: 100
    },
    speechBubble: {
        width: 200,
        height: 150,
        alignItems: "center",
        justifyContent: "center",
    },
    answer: {
        fontSize: 32
    },
    link: {
        alignSelf: "center",
        marginBottom: 20
    }
});

export default MainScreen;