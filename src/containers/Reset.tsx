import React from "react";
import {Alert, BackHandler, DeviceEventEmitter, StyleSheet, Text, View} from 'react-native'
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import {FontAwesome} from "@expo/vector-icons";
import Button from "../components/Button";
import ErrorModal from "../components/errorModal";
import SuccessfulCard from "../components/SuccessfulCard";
import Form from "../components/Form";
import Transport from "../api/Transport";
import {camelize, checkEmail, getSecureStoreItem} from "../utils/CommonFunction";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    isLoading: boolean;
    success: boolean;
    error: boolean;
    Email: string;
    errors: any;
    idx: number;
    disabled: boolean;
}

export default class Reset extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            isLoading: false,
            success: false,
            error: false,
            errors: [],
            Email: '',
            idx: 0,
            disabled: true
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
        this.setState({disabled: true})
    }

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        const {reset} = this.props.route.params

        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1, width: '100%', alignSelf: 'center'}}>
                {
                    reset.errorMessage &&
                    <ErrorModal navigation={this.props.navigation}
                                modalVisible={this.state.error}
                                onRequestClose={(index: number) => {
                                    if (index === 0) {
                                        this.setState({error: false})
                                        this.props.navigation.pop()
                                    } else {
                                        this.setState({error: false})
                                    }
                                }}
                                style={{}}
                                errorMessage={reset.errorMessage}
                                idx={this.state.idx}/>
                }
                {
                    reset.successMessage &&
                    <SuccessfulCard
                        successMessage={reset.successMessage}
                        cardViewContent={undefined}
                        height={undefined}
                        width={undefined} style={{}}
                        navigation={this.props.navigation}
                        modalVisible={this.state.success}
                        onRequestClose={() => {
                            this.setState({success: false})
                            if (reset.isSetting) {
                                DeviceEventEmitter.emit('reloadProfile')
                                this.props.navigation.goBack()
                            } else {
                                this.props.navigation.navigate('Auth')
                            }
                        }}/>
                }

                <View style={{marginHorizontal: 32, marginVertical: 65, flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome name={reset.isSetting ? "chevron-left" : "close"} size={24} color={Colors.white}
                                 style={{marginRight: 25}} onPress={() => {
                        if (reset.isSetting) {
                            this.setState({error: true})
                        } else {
                            this.props.navigation.pop()
                        }
                    }}/>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                        {reset.passwordScreen ? reset.headers[1] : reset.headers[0]}</Text>
                </View>

                <Form data={reset.passwordScreen ? reset.password_forms : reset.forms}
                      onChangeText={(label: string, value: string) => {
                          // @ts-ignore
                          this.setState({
                              [label]: value,
                              disabled: reset.passwordScreen ? Object.keys(this.state).length < 4 : value.length < 1
                          })
                      }} initialValue={this.state} error={this.state.errors}/>

                <Button onPress={() => {
                    if (reset.isSetting) {
                        this.updateProfile(reset.forms, this.state)
                    } else {
                        let Email = this.state.Email.toLowerCase()
                        if (reset.passwordScreen) {
                            // @ts-ignore
                            let Password = this.state.Password
                            // @ts-ignore
                            let ConfirmPassword = this.state.ConfirmPassword
                            if (Password === ConfirmPassword) {
                                const Email: string = this.props.route.params.signupInfo.Email.toLowerCase()
                                const OTP: string = this.props.route.params.OTP
                                this.resetPassword(Email, Password, OTP)
                            } else {
                                this.setState({error: true, errors: ['ConfirmPassword']})
                            }
                        } else {
                            if (checkEmail(Email)) {
                                this.setState({isLoading: true, idx: 0})
                                this.sendOTP(Email)
                            } else {
                                this.setState({error: true, idx: 1})
                            }
                        }
                    }
                }}
                        label={reset.passwordScreen ? reset.buttons[1] : reset.buttons[0]}
                        isLoading={this.state.isLoading}
                        style={{position: 'absolute', bottom: 10, width: '85%'}}
                        noBorder={false} disabled={this.state.disabled}/>

            </View>
        );
    }

    updateProfile(data: any, values: any) {
        getSecureStoreItem('token').then(token => {
            let newProfile = {[camelize(data[0].label)]: values[data[0].label] || ''}
            Transport.User.updateProfile(JSON.parse(token), newProfile)
                .then((response: any) => {
                    if (response.data.success) {
                        this.setState({success: true})
                    } else {
                        Alert.alert('ERROR', 'Unable to update your profile!')
                    }
                }).catch((err: any) => {
                alert('Unable to update your profile!')
            })
        })
    }

    sendOTP(Email: string) {
        let data = {
            "email": Email
        }
        Transport.Auth.sendOTP(data)
            .then((res: any) => {
                if (res.data.code === 400) {
                    Alert.alert('Sorry', res.data.data)
                } else {
                    Alert.alert('Sent', `OTP sent to ${Email}\nPlease check your email`, [
                        {
                            text: 'Continue',
                            onPress: () => {
                                this.props.navigation.navigate('Verification', {
                                    signupInfo: {
                                        Email,
                                        isResetPassword: true
                                    }
                                })
                            }
                        }
                    ])
                }
            })
            .catch((error: any) => Alert.alert('Error', error.message))
            .finally(() => this.setState({isLoading: false}))
    }

    resetPassword(Email: string, Password: string, OTP: string) {
        let data = {
            "email": Email,
            "newPassword": Password,
            "otp": OTP
        }
        Transport.Auth.resetPassword(data)
            .then((res: any) => {
                if (res.data.success) {
                    this.setState({success: true})
                } else {
                    Alert.alert('Error', 'Couldn\'t update your profile!')
                }
            })
            .catch((error: any) => {
                Alert.alert('Error', error.message)
            })
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

