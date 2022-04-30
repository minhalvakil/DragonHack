import React from "react";
import {
    TouchableOpacity,
    Text,
    StyleSheet
} from "react-native";

const Button = (props) => {
    const {
        title,
        titleStyle,
        style,
        ...restOfProps
    } = props;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                style
            ]}
            {...restOfProps}
        >
            <Text
                style={[
                    styles.text,
                    titleStyle
                ]}
            >
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        padding: 15,
        borderRadius: 15,
        backgroundColor: "#1F2A35"
    },
    text: {
        textAlign: "center",
        color: "white",
        fontSize: 24
    }
});

export default Button;