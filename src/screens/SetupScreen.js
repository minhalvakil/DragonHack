import React, { useState, useEffect } from "react";
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet
} from "react-native";
import Selection from "../components/Selection";
import Button from "../components/Button";
import requestLocation from "../helpers/requestLocation";
import AsyncStorage from '@react-native-async-storage/async-storage';

const SetupScreen = ({ navigation }) => {
    const [location, setLocation] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);
    const [mandateOnly, setMandateOnly] = useState(true);

    // Get location on load
    useEffect(() => {
        requestLocation()
        .then(location => {
            setLocation(location);
        })
        .catch(error => {
            setErrorMessage(error.message);
        });
    }, []);

    let text = errorMessage || (
        location
            ? JSON.stringify(location)
            : 'Waiting..'
    );

    const onsubmit = () => {
        AsyncStorage.setItem('settings', JSON.stringify({
            mandateOnly
        }))
        .then(() => {
            navigation.navigate("Main");
        });
    };

    return (
        <SafeAreaView
            style={styles.container}
        >
            {/*
                location ? (
                    Object.keys(location).map((item, index) => {
                        return (
                            <Text key={index}>{item}: {location[item]}</Text>
                        );
                    })
                ) : (
                    <Text style={{fontSize: 32}}>{text}</Text>
                )
            */}
            <Text style={styles.header}>
                Setup
            </Text>
            <Selection
                option={mandateOnly ? 1 : 2}
                setOption={(option) => setMandateOnly(option === 1)}
                option1="Mandate Only"
                option1Subtext="Get notified only if there is a mandate in place in your location"
                option2="Mask Reccomendation"
                option2Subtext="Get notified if wearing a mask is reccomended in your area based on cases"
            />
            <Button
                title="Next"
                style={styles.submit}
                onPress={onsubmit}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: 20
    },
    header: {
        fontSize: 32,
        textAlign: 'center',
        marginTop: 32,
        marginBottom: 32
    },
    submit: {
        marginTop: 15
    }
});

export default SetupScreen;