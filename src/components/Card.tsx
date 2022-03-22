import React from "react";
import {StyleSheet, View} from "react-native";
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";

export interface Props {
    cardViewContent: any;
    height: any;
    width: any;
    style: any;
}

interface State {
}

export default class Card extends React.Component<Props, State> {

    render() {
        return (
            <View style={[styles(this.props).userInfo, styles(this.props).card, this.props.style]}>
                {this.props.cardViewContent()}
            </View>
        );
    }
}

const styles = (props: any) => StyleSheet.create({
    userInfo: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 15,
        backgroundColor: 'white',
    },
    card: {
        height: props.height ? props.height : null,
        width: props.width ? props.width : '93.27%',
        borderColor: Colors.white,
        borderWidth: Constants.borderWidth,
        borderRadius: Constants.radius,
        padding: 10,
        shadowColor: Colors.shadowColor,
        shadowOpacity: Constants.opacity,
        shadowRadius: Constants.shadowRadius,
        elevation: Constants.elevation,
    }
});
