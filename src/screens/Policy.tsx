import React from "react";
import {Alert, BackHandler, DeviceEventEmitter, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native'
import Colors from "../utils/colors";
import {FontAwesome} from "@expo/vector-icons";
import {Constants} from "../utils/constants";
import Button from "../components/Button";
import Transport from "../api/Transport";
import {addToSecureStore} from "../utils/CommonFunction";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    isLoading: boolean;
    isLogin: boolean;
}

export default class Policy extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            isLoading: false,
            isLogin: false
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.pop();
        return true;
    };

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        const {policy, button, signupInfo, buttonName} = this.props.route.params
        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                <SafeAreaView style={{backgroundColor: Colors.primaryColor, paddingHorizontal: 32, flex: 1}}>
                    <View style={{marginTop: 50, flexDirection: 'row', alignItems: 'center'}}>
                        <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                     onPress={() => this.props.navigation.pop()}/>
                        <Text allowFontScaling={false}
                            // @ts-ignore
                              style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                            {policy.title}</Text>
                    </View>
                    <ScrollView style={{marginVertical: 25}}>
                        <Text allowFontScaling={false}
                            // @ts-ignore
                              style={{
                                  color: Colors.white,
                                  fontWeight: Constants.fontWeight,
                                  fontSize: 14
                              }}>{policy.subTitle}</Text>
                        <Text allowFontScaling={false} style={{
                            fontSize: 12.25,
                            textAlign: 'justify',
                            marginTop: 10,
                            color: Colors.textColor_2
                        }}>{policy.body}</Text>
                        {
                            button &&
                            <Button onPress={() => {
                                if (buttonName) {
                                } else {
                                    this.signUp(signupInfo)
                                }
                            }}
                                    label={buttonName || 'I Agree'}
                                    isLoading={this.state.isLoading}
                                    style={{marginTop: buttonName ? '170%' : null, marginBottom: 25}}
                                    noBorder={false}
                                    disabled={false}/>
                        }
                    </ScrollView>
                </SafeAreaView>
            </View>
        );
    }

    signUp(signupInfo: any) {
        this.setState({isLoading: true})
        let data = {
            "userRole": "EPO",
            "fullName": `${signupInfo.FirstName} ${signupInfo.LastName}`,
            "email": signupInfo.Email.toLowerCase(),
            "phoneNumber": signupInfo.PhoneNumber,
            "password": signupInfo.Password,
            "isAdmin": false,
            "state": signupInfo.State,
            "height": signupInfo.Height,
            "weight": signupInfo.Weight,
            "age": signupInfo.Age,
            "workingExperience": signupInfo.Experience,
            "city": signupInfo.City
        }

        Transport.Auth.signup(data)
            .then((res: any) => {
                if (res.data.success) {

                    addToSecureStore('token', res.data.token).then(r => {
                        this.props.navigation.navigate('Verification', {
                            signupInfo: {
                                ...signupInfo,
                                isResetPassword: false
                            }
                        })
                    })
                } else {
                    Alert.alert('Error', res.data.data, [
                        {
                            text: "Login",
                            onPress: () => {
                                DeviceEventEmitter.emit('renderLogin')
                                this.props.navigation.navigate('Auth')
                            }
                        }

                    ])
                }
                this.setState({isLoading: false})
            })
            .catch((error: any) => {
                Alert.alert('Error', error)
                this.setState({isLoading: false})

            })
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

