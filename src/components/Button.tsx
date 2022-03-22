import React from "react";
import {ActivityIndicator, BackHandler, StyleSheet, Text, TouchableOpacity} from 'react-native'
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";

export interface Props {
    onPress: any;
    label: string;
    isLoading: boolean;
    style: any;
    noBorder: boolean;
    disabled: boolean;
    isCheckbox?: boolean
}

interface State {
}

export default class Button extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {}
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        return (
            <TouchableOpacity
                disabled={this.props.isLoading || this.props.disabled}
                style={[styles(this.props).buttonStyle, this.props.style]}
                onPress={() => this.props.onPress()}>
                {
                    (!this.props.noBorder || (this.props.noBorder && !this.props.isLoading)) &&
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={[{
                              flex: this.props.isLoading ? .6 : null,
                              textAlign: 'right',
                              color: this.props.style.color || Colors.white,
                              fontSize: 14,
                              fontWeight: Constants.fontWeight
                          }]}>{this.props.label}</Text>
                }
                {
                    this.props.isLoading &&
                    <ActivityIndicator style={styles(this.props).loadingSpinner} size={"small"} color={'white'}/>
                }
            </TouchableOpacity>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({
        loadingSpinner: {
            // @ts-ignore
            flex: props.isLoading && !props.noBorder ? .45 : null
        },
        buttonStyle: {
            width: '95%',
            marginVertical: 10,
            height: 48,
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: Constants.borderRadius,
            // @ts-ignore
            backgroundColor: props.noBorder ? null : props.isLoading || props.disabled ? Colors.gray : Colors.secondaryColor,
            alignSelf: 'center',
            flexDirection: 'row'
        }
    });
};
