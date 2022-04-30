import * as Location from 'expo-location';

const requestLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        throw Error("Permission to access location was denied");
    }

    let location = await Location.getCurrentPositionAsync({});
    const precise = await Location.reverseGeocodeAsync(location.coords, {});
    return precise[0];
};

export default requestLocation;