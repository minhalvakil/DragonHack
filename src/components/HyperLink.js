import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const HyperLink = (props) => {
    const {
        children,
        style
    } = props;

    return (
        <TouchableOpacity>
            <Text
                style={[
                    styles.text,
                    style
                ]}
            >
                {children}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 24,
        textDecorationLine: "underline",
    }
});

export default HyperLink;