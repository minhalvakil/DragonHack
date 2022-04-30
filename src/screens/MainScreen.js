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
import axios from "axios";
import * as Linking from 'expo-linking';

const MainScreen = ({ navigation }) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [communityLevel, setCommunityLevel] = useState(null);
    //const [settings, setSettings] = useState(null);

    const onResetSettings = () => {
        AsyncStorage.removeItem('settings')
        .then(() => {
            navigation.navigate("Setup");
        })
        .catch(error => {
            Alert.alert("An error occured", error.message);
        });
    };

    const onLearnCdc = () => {
        Linking.openURL("https://www.cdc.gov/coronavirus/2019-ncov/your-health/covid-by-county.html");
    };

    useEffect(() => {
        //AsyncStorage.getItem('settings')
        //.then(value => {
        //setSettings(JSON.parse(value));
        
        // Get the user's location
        requestLocation()
        .then(location => {
            const stateFIPS = FIPS[location.region];
            let noResults = true;
            stateFIPS.forEach(item => {
                if(item[location.city] !== undefined){
                    noResults = false;
                    const fipsCode = item[location.city];
                    const API_KEY = "6729f851afe44c8782ea316bb783fbaf";
                    axios({
                        method: "get",
                        url: `https://api.covidactnow.org/v2/county/${fipsCode}.json?apiKey=${API_KEY}`
                    })
                    .then(response => {
                        const commLevel = response.data.communityLevels.cdcCommunityLevel;
                        switch(commLevel){
                            case 0:
                                setAnswer("No");
                                setCommunityLevel("Low");
                                break;
                            case 1:
                                setAnswer("Probably");
                                setCommunityLevel("Medium");
                                break;
                            case 2:
                                setAnswer("Yes");
                                setCommunityLevel("High");
                                break;

                        }
                    })
                    .catch(error => {
                        Alert.alert("An error occured", error.message);
                    })
                }
            });
            if(noResults){
                setErrorMessage("Unable to find results for your location");
            }
        })
        .catch(error => {
            setErrorMessage(error.message);
        });
        //});
    }, []);

    let fauciSrc = require(`../../assets/curious-fauci.png`);
    switch(answer){
        case "No":
            fauciSrc = require(`../../assets/sad-fauci.png`);
            break;
        case "Probably":
            fauciSrc = require(`../../assets/curious-fauci.png`);
            break;
        case "Yes":
            fauciSrc = require(`../../assets/happy-fauci.png`);
            break;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.main}>
                <Text style={styles.header}>
                    Should you wear a mask today?
                </Text>
                <Text style={styles.header}>Fauci says</Text>
                <View style={styles.fauci}>
                    <Image
                        source={fauciSrc}
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
                <Text style={styles.errorMessage}>
                    {
                        errorMessage && errorMessage
                    }
                </Text>
            </View>
            <View>
                <Text style={styles.communityLevelLabel}>
                    Community Level:
                </Text>
                <Text
                    style={[
                        styles.communityLevel,
                        communityLevel ? {
                            color: communityLevel === "Low"
                                ? "#00BA3F"
                                : communityLevel === "Medium"
                                    ? "#BA9100"
                                    : "#F44242"
                        } : {}
                    ]}
                >
                    {communityLevel || "Loading"}
                </Text>
                <HyperLink
                    style={styles.levelsMeaning}
                    onPress={onLearnCdc}
                >
                    Learn what the CDC's community levels mean
                </HyperLink>
            </View>
            <View>
                <HyperLink
                    style={styles.link}
                >
                    More Info
                </HyperLink>
                {/*<HyperLink
                    onPress={onResetSettings}
                    style={styles.link}
                >
                    Reset settings
                </HyperLink>*/}
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
    },
    loading: {
        fontSize: 24,
        opacity: 0.5,
        textAlign: "center",
        marginTop: 25
    },
    errorMessage: {
        fontSize: 24,
        opacity: 0.5,
        textAlign: "center",
        marginTop: 25,
        color: "red"
    },
    communityLevelLabel: {
        fontSize: 24,
        opacity: 0.5,
        textAlign: "center",
    },
    communityLevel: {
        fontSize: 32,
        opacity: 0.75,
        textAlign: "center",
        marginTop: 25,
        fontWeight: "600"
    },
    levelsMeaning: {
        fontSize: 18,
        width: 200,
        textAlign: "center",
        alignSelf: "center",
        marginVertical: 25
    }
});

export default MainScreen;