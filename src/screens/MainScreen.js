import React, { useState, useEffect } from "react";
import {
    Alert,
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    StatusBar,
    Modal
} from "react-native";
import Button from "../components/Button";
import HyperLink from "../components/HyperLink";
import AsyncStorage from '@react-native-async-storage/async-storage';
import requestLocation from "../helpers/requestLocation";
import FIPS from "../FIPS/FIPS.json";
import axios from "axios";
import * as Linking from "expo-linking";
import environment_variables from "../../environment_variables.json";

const MainScreen = ({ navigation }) => {
    const [errorMessage, setErrorMessage] = useState(null);
    const [answer, setAnswer] = useState(null);
    const [communityLevel, setCommunityLevel] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [weeklyCases, setWeeklyCases] = useState(null);
    const [newHospitalizations, setNewHospitalizations] = useState(null);
    const [percentVaccinated, setPercentVaccinated] = useState(null);
    const [location, setLocation] = useState(null);
    //const [settings, setSettings] = useState(null);

    const API_KEY = environment_variables["API_KEY"];

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

    const togglePopup = () => {
        setShowPopup(!showPopup);
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
                    let fipsCode = item[location.city];
                    // High risk location
                    //setLocation("Hamilton, NY");
                    //fipsCode = 36041
                    // Medium risk location
                    //setLocation("Middlesex, MA");
                    //fipsCode = 25017
                    // Low risk location
                    //fipsCode = 42101
                    //setLocation("Philadelphia, PA");
                    // Unkown risk location
                    //fipsCode = 29204
                    //setLocation("Shanon County, MO");
                    axios({
                        method: "get",
                        url: `https://api.covidactnow.org/v2/county/${fipsCode}.json?apiKey=${API_KEY}`
                    })
                    .then(response => {
                        const {
                            data
                        } = response;
                        const {
                            metrics: {
                                weeklyNewCasesPer100k,
                                weeklyCovidAdmissionsPer100k,
                                vaccinationsInitiatedRatio
                            }
                        } = data;
                        setWeeklyCases(weeklyNewCasesPer100k);
                        setNewHospitalizations(weeklyCovidAdmissionsPer100k);
                        setPercentVaccinated(vaccinationsInitiatedRatio * 100);
                        setLocation(`${location.city}, ${location.region}`);
                        const commLevel = data.communityLevels.cdcCommunityLevel;
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
                        Alert.alert("Could not find COVID data in your region");
                        setCommunityLevel("N/A");
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
            <StatusBar barStyle="dark-content"/>
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
                <Text style={[
                    styles.communityLevelLabel,
                    styles.location
                ]}>
                    {
                        location ? (
                        <>
                            <Image
                                source={require("../../assets/location.png")}
                                style={styles.locationImage}
                                resizeMode="contain"
                            />
                            <View
                                style={{
                                    width: 10
                                }}
                            />
                            <Text>
                                {location}
                            </Text>
                        </>
                        ) : "Loading"
                    }
                </Text>
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
                                    : communityLevel === "High"
                                        ? "#F44242"
                                        : "black"
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
                    onPress={togglePopup}
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
            <Modal
                animationType="slide"
                transparent={true}
                visible={showPopup}
                onRequestClose={() => {
                    Alert.alert("Modal has been closed.");
                    setShowPopup(!showPopup);
                }}
            >
                <View
                    style={styles.popup}
                >
                    <View>
                        <Text style={styles.statHeader}>Weekly Cases</Text>
                        <Text style={styles.stat}>{weeklyCases || "Loading"}</Text>
                        <Text style={styles.statFooter}>per 100k people</Text>
                        <Text style={styles.statHeader}>New Hospitalizations</Text>
                        <Text style={styles.stat}>{newHospitalizations || "Loading"}</Text>
                        <Text style={styles.statFooter}>per 100k people</Text>
                        <Text style={styles.statHeader}>Vaccinated</Text>
                        <Text style={styles.stat}>{percentVaccinated ? `${percentVaccinated}%` : "Loading"}</Text>
                        <Text style={styles.statFooter}>with 1 or more doses</Text>
                    </View>
                    <View style={styles.popupFooter}>
                        <Button
                            title="Close"
                            onPress={togglePopup}
                        />
                    </View>
                </View>
            </Modal>
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
        marginTop: 25
    },
    fauci: {
        marginTop: 50,
        flexDirection: "row",
        justifyContent: "center",
    },
    fauciImage: {
        borderRadius: 999,
        marginTop: 100,
        height: 150,
        width: 150,
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
        marginTop: 25,
        color: "#437EB4"
    },
    popup: {
        backgroundColor: "white",
        flex: 1,
        justifyContent: "space-between",
        margin: 20,
        marginVertical: 50,
        padding: 20,
        borderRadius: 25,
        shadowColor: 'grey',
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.2,
        shadowRadius: 15,
    },
    statHeader: {
        fontSize: 32,
        textAlign: "center",
        marginTop: 25,
        fontWeight: "500",
        color: "#1F2A35"
    },
    stat: {
        fontSize: 24,
        textAlign: "center",
        marginTop: 25
    },
    statFooter: {
        fontSize: 18,
        textAlign: "center",
        marginTop: 25
    },
    location: {
        marginBottom: 25,
        alignSelf: "center",
    },
    locationImage: {
        width: 14,
        height: 24
    }
});

export default MainScreen;