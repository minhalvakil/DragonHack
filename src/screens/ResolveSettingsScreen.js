import React, { useEffect } from "react";
import { SafeAreaView, Text } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ResolveSettingsScreen = ({ navigation }) => {

    useEffect(() => {
        AsyncStorage.getItem('settings')
        .then(value => {
            if(value === null){
                navigation.navigate("Setup");
            }
            else{
                navigation.navigate("Main");
            }
        });
    }, []);

    return (
        <SafeAreaView>
            <Text>Loading</Text>
        </SafeAreaView>
    );
};

export default ResolveSettingsScreen;