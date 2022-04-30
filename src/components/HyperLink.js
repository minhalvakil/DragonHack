import React from "react";
import { TouchableOpacity, Text } from "react-native";

const HyperLink = (props) => {
    const {
        children
    } = props;

    return (
        <TouchableOpacity>
            <Text>{children}</Text>
        </TouchableOpacity>
    );
};

export default HyperLink;