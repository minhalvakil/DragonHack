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
import Button from "../components/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';

const MainScreen = ({ navigation }) => {
    const [settings, setSettings] = useState(null);
    const [answer, setAnswer] = useState(null);

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
                            {answer || "..."}
                        </Text>
                    </ImageBackground>
                </View>
            </View>
            <View>
                <Button
                    title="Reset settings"
                    onPress={onResetSettings}
                />
                <Button
                    title="Reset settings"
                    onPress={onResetSettings}
                />
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
    }
});

export default MainScreen;