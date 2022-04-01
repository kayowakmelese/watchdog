import React from "react";
import {BackHandler, StyleSheet, TextInput, View} from 'react-native'
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import Button from "./Button";

export interface Props {
    onLeftPress: any;
    onRightPress: any;
    label: any;
    style: any;
    onValueEdited: any;
}

interface State {
    label: any
}

export default class Counter extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            label: this.props.label || 0
        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        return true;
    };

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
        this.setState({label: nextProps.label})
    }

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        return (
            <View style={[{flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}, this.props.style]}>
                <Button onPress={() => this.props.onLeftPress()}
                        label={'-'}
                        isLoading={false}
                        style={{width: '20%', marginRight: -10, borderTopEndRadius: 0, borderBottomEndRadius: 0}}
                        noBorder={false}
                        disabled={this.props.label === 0}/>
                <TextInput
                    keyboardType={'decimal-pad'}
                    allowFontScaling={false}         // @ts-ignore
                    style={{
                        width: '70%',
                        fontSize: 22,
                        alignSelf: 'center',
                        borderColor: Colors.secondaryColor,
                        borderBottomWidth: Constants.borderWidth / 2,
                        borderTopWidth: Constants.borderWidth / 2,
                        paddingVertical: 7,
                        paddingHorizontal: 15,
                        textAlign: 'center',
                        fontWeight: Constants.fontWeight
                    }}
                    value={`$ ${this.state.label}`}
                    onChangeText={(value: string) => {
                        if (value.length > 2) {
                            let v1:any=value.includes('$ ')?value.replace('$ ',''):null
                            console.log("warisreal",v1)
                            this.setState({label: parseFloat(value.replace('$ ', ''))})
                            this.props.onValueEdited(value.replace('$ ', ''))
                        } else {
                            this.setState({label: 0})
                            this.props.onValueEdited(0)
                        }
                    }}
                />
                <Button onPress={() => this.props.onRightPress()}
                        label={'+'}
                        isLoading={false}
                        style={{width: '20%', marginLeft: -10, borderTopStartRadius: 0, borderBottomStartRadius: 0}}
                        noBorder={false}
                        disabled={this.props.label === 0}/>

            </View>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};
