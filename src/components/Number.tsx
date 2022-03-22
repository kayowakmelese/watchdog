import React from "react";
import {StyleSheet, TextInput, View} from "react-native";
import {Constants} from "../utils/constants";
import Colors from "../utils/colors";

export interface Props {
    error: boolean
    codeSubmitted: any;
    resetValue: boolean;
    valueChanging: any;
    isSecure: boolean;
}

interface State {
    value: any;
}

export default class Numbers extends React.Component<Props, State> {
    secondTextInput: null;
    firstTextInput: null;
    thirdTextInput: null;
    forthTextInput: null;

    constructor(Props: any) {
        super(Props);
        this.firstTextInput = null
        this.secondTextInput = null
        this.thirdTextInput = null
        this.forthTextInput = null
        this.state = {
            value: []
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
        if (nextProps.resetValue) {
            this.setState({value: []})
            // @ts-ignore
            this.firstTextInput.focus();
        }
    }

    render() {
        return (
            <View style={{alignSelf: 'center', flexDirection: 'row'}}>
                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 63,
                    height: 72,
                    borderWidth: Constants.borderWidth,
                    margin: 14,
                    borderRadius: Constants.radius,
                    borderColor: this.props.error ? Colors.secondaryColor : Colors.gray
                }}>
                    <TextInput
                        // @ts-ignore
                        style={{fontSize: 24, color: Colors.white, fontWeight: Constants.fontWeight}}
                        value={this.props.isSecure ? this.state.value[0] ? '*' : '' : this.state.value[0]}
                        maxLength={1}
                        focusable
                        autoFocus={true}
                        allowFontScaling={false}
                        returnKeyType="next"
                        onSubmitEditing={() => {
                            // @ts-ignore
                            this.secondTextInput.focus();
                        }}
                        ref={(input) => {
                            // @ts-ignore
                            this.firstTextInput = input;
                        }}
                        blurOnSubmit={false}
                        keyboardType={'numeric'}
                        onChangeText={(value) => {
                            let pastValue = this.state.value
                            pastValue[0] = value
                            this.setState({value: pastValue})
                            if (pastValue[0].length !== 0) {
                                // @ts-ignore
                                this.secondTextInput.focus();
                            }
                        }}/>
                </View>

                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 63,
                    height: 72,
                    borderWidth: Constants.borderWidth,
                    margin: 14,
                    borderRadius: Constants.radius / 1.5,
                    borderColor: this.props.error ? Colors.secondaryColor : Colors.gray
                }}>
                    <TextInput
                        // @ts-ignore
                        style={{fontSize: 24, color: Colors.white, fontWeight: Constants.fontWeight}}
                        value={this.props.isSecure ? this.state.value[1] ? '*' : '' : this.state.value[1]}
                        maxLength={1}
                        returnKeyType="next"
                        keyboardType={'numeric'}
                        allowFontScaling={false}
                        ref={(input) => {
                            // @ts-ignore
                            this.secondTextInput = input;
                        }}
                        onSubmitEditing={() => {
                            // @ts-ignore
                            this.thirdTextInput.focus();
                        }}
                        blurOnSubmit={false}
                        onChangeText={(value) => {
                            let pastValue = this.state.value
                            pastValue[1] = value
                            this.setState({value: pastValue})

                            if (pastValue[1].length !== 0) {
                                // @ts-ignore
                                this.thirdTextInput.focus()
                            } else {
                                // @ts-ignore
                                this.firstTextInput.focus()
                            }
                        }}/>
                </View>

                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 63,
                    height: 72,
                    borderWidth: Constants.borderWidth,
                    margin: 14,
                    borderRadius: Constants.radius / 1.5,
                    borderColor: this.props.error ? Colors.secondaryColor : Colors.gray
                }}>
                    <TextInput
                        // @ts-ignore
                        style={{fontSize: 24, color: Colors.white, fontWeight: Constants.fontWeight}}
                        value={this.props.isSecure ? this.state.value[2] ? '*' : '' : this.state.value[2]}
                        maxLength={1}
                        returnKeyType="next"
                        allowFontScaling={false}
                        keyboardType={'numeric'}
                        ref={(input) => {
                            // @ts-ignore
                            this.thirdTextInput = input;
                        }}
                        onSubmitEditing={() => {
                            // @ts-ignore
                            this.forthTextInput.focus();
                        }}
                        blurOnSubmit={false}
                        onChangeText={(value) => {
                            let pastValue = this.state.value
                            pastValue[2] = value
                            this.setState({value: pastValue})
                            if (pastValue[2].length !== 0) {
                                // @ts-ignore
                                this.forthTextInput.focus()
                            } else {
                                // @ts-ignore
                                this.secondTextInput.focus()
                            }
                        }}/>
                </View>

                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 63,
                    height: 72,
                    borderWidth: Constants.borderWidth,
                    margin: 14,
                    borderRadius: Constants.radius / 1.5,
                    borderColor: this.props.error ? Colors.secondaryColor : Colors.gray
                }}>
                    <TextInput
                        // @ts-ignore
                        style={{fontSize: 24, color: Colors.white, fontWeight: Constants.fontWeight}}
                        value={this.props.isSecure ? this.state.value[3] ? '*' : '' : this.state.value[3]}
                        maxLength={1}
                        returnKeyType="next"
                        allowFontScaling={false}
                        keyboardType={'numeric'}
                        ref={(input) => {
                            // @ts-ignore
                            this.forthTextInput = input;
                        }}
                        onChangeText={(value) => {
                            if (value.length === 0) {
                                // @ts-ignore
                                this.thirdTextInput.focus()
                            }
                            let pastValue = this.state.value
                            pastValue[3] = value
                            this.setState({value: pastValue})
                            if (this.state.value.length === 4 &&
                                this.state.value[0] !== '' &&
                                this.state.value[1] !== '' &&
                                this.state.value[2] !== '' &&
                                value !== '') {
                                this.props.codeSubmitted(this.state.value)
                            } else {
                                this.props.valueChanging()
                            }
                        }}/>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {},
});
