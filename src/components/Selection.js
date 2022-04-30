import React from "react";
import {
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
} from "react-native";

const Selection = (props) => {
    const {
        option1,
        option1Subtext,
        option2,
        option2Subtext,
        option,
        setOption
    } = props;

    return (
        <View style={styles.container}>
            <View style={styles.selection}>
                <TouchableOpacity
                    style={[
                        styles.option,
                        option === 1 ? styles.selectedOption : null
                    ]}
                    onPress={() => setOption(1)}
                >
                    <Text style={[
                        styles.optionText,
                        option === 1 ? styles.selectedOptionText : null
                    ]}>{option1}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.option,
                        option === 2 ? styles.selectedOption : null
                    ]}
                    onPress={() => setOption(2)}
                >
                    <Text style={[
                        styles.optionText,
                        option === 2 ? styles.selectedOptionText : null
                    ]}>{option2}</Text>
                </TouchableOpacity>
            </View>
            <Text style={styles.subtext}>
                {
                    option === 1 ? option1Subtext : option2Subtext
                }
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
    selection: {
        flexDirection: "row",
        backgroundColor: "#E5E5E5",
        alignItems: "stretch",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 15,
        overflow: "hidden",
    },
    option: {
        flex: 1,
        padding: 15,
        alignItems: "center",
        justifyContent: "center",
    },
    selectedOption: {
        backgroundColor: "#1F2A35"
    },
    selectedOptionText: {
        color: "white"
    },
    optionText: {
        fontSize: 18
    },
    subtext: {
        marginTop: 20,
        textAlign: "center",
        opacity: 0.5
    }
});

export default Selection;