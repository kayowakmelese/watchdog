import React from "react";
import {Alert, BackHandler, StyleSheet, Text, View} from 'react-native'
import Colors from "../../utils/colors";
import Form from "../../components/Form";
import Button from "../../components/Button";
import ErrorModal from "../../components/errorModal";
import Strings from "../../utils/strings";
import Transport from "../../api/Transport";
import {addToSecureStore} from "../../utils/CommonFunction";
import {Constants} from "../../utils/constants";
import CustomModal from "../../components/CustomModal";
import Card from "../../components/Card";
import Numbers from "../../components/Number";

import * as linking from 'expo-linking'
export interface Props {
    navigation: any;
    loginData: any;
    onSignUp: any;
}

interface State {
    isLoading: boolean;
    showVerification: boolean;
    loginInfo: any;
    error: boolean;
    errors: any;
    disabled: boolean;
    codeValues: any;
}

export default class Login extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            error: false,
            errors: [],
            isLoading: false,
            showVerification: false,
            disabled: true,
            codeValues: [],
            loginInfo: {}
        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        linking.addEventListener("url",(event)=>{
            let data=linking.parse(event.url);
            console.log("thisisdata",JSON.stringify(this.props))
        })
        console.log("Props",this.props)
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {

        const {navigation} = this.props

        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1}}>

                <CustomModal
                    navigation={navigation}
                    modalVisible={this.state.showVerification}
                    onRequestClose={() => this.setState({showVerification: false})}
                    renderView={() => {
                        return (
                            <Card cardViewContent={() => {
                                return (
                                    <View style={{
                                        width: '100%',
                                        backgroundColor: Colors.primaryColor,
                                        alignItems: 'center',
                                        padding: '5%'
                                    }}>

                                        <Text allowFontScaling={false}
                                            // @ts-ignore
                                              style={{
                                                  color: Colors.white,
                                                  fontSize: 24,
                                                  fontWeight: Constants.fontWeight
                                              }}>
                                            {Strings.auth.verification.header}</Text>
                                        <View
                                            style={{marginTop: '5%', marginBottom: '3%', marginLeft: -75}}>
                                            <Text allowFontScaling={false}
                                                  style={{
                                                      marginBottom: 10,
                                                      fontSize: 14,
                                                      color: Colors.white
                                                  }}>{Strings.auth.verification.title}</Text>
                                            <Text allowFontScaling={false}
                                                // @ts-ignore
                                                  style={{
                                                      // marginBottom: 19,
                                                      fontSize: 14,
                                                      textAlign: 'left',
                                                      fontWeight: Constants.fontWeight,
                                                      color: Colors.white
                                                  }}>{this.state.loginInfo?.Email?.toLowerCase() || ' --- '}</Text>
                                        </View>

                                        <Numbers error={this.state.error}
                                                 codeSubmitted={(codeValues: any) => {
                                                     this.setState({codeValues, disabled: false})
                                                 }} resetValue={false}
                                                 valueChanging={() => {
                                                     this.setState({
                                                         disabled: true,
                                                         error: false
                                                     })
                                                 }} isSecure={false}/>
                                        <Button onPress={() => {
                                            let pass = this.state.codeValues
                                            let verifyData: any = {
                                                "email": this.state.loginInfo.Email.toLowerCase(),
                                                "otp": parseInt(pass.join(''))
                                            }
                                            this.verifyCode(verifyData).finally(() => this.setState({isLoading: false}))
                                        }} label={'Verify'} isLoading={this.state.isLoading}
                                                style={{marginTop: 25}} noBorder={false}
                                                disabled={this.state.disabled}/>
                                    </View>
                                )
                            }} height={undefined} width={'110%'}
                                  style={{backgroundColor: Colors.primaryColor}}/>
                        )
                    }}
                    center={false} style={{backgroundColor: Colors.primaryColor}}/>

                <ErrorModal modalVisible={this.state.error}
                            onRequestClose={() => this.setState({error: false})}
                            style={{}}
                            errorMessage={this.props.loginData.errorMessage}
                            navigation={this.props.navigation}
                            idx={0}/>

                <Form
                    initialValue={this.state.loginInfo} data={this.props.loginData.forms}
                    onChangeText={(label: string, value: any) => {
                        let loginInfo = this.state.loginInfo
                        if (value.length !== 0) {
                            let errors = this.state.errors
                            const index = errors.indexOf(label);
                            if (index > -1) {
                                errors.splice(index, 1);
                                this.setState({errors})
                            }
                            loginInfo[label] = value
                        } else {
                            delete loginInfo[label]
                        }
                        this.setState({loginInfo})
                    }} error={this.state.errors}/>
                {
                    this.props.loginData.buttons.map((element: any, idx: number) => {
                        return <Button key={idx} disabled={idx === 0 && Object.keys(this.state.loginInfo).length !== 2}
                                       onPress={() => {
                                           switch (idx) {
                                               case 0:
                                                   this.setState({isLoading: true})
                                                   this.login().finally(() => this.setState({isLoading: false}))
                                                   break;
                                               case 1:
                                                   this.props.navigation.navigate('Reset', {
                                                       reset: {
                                                           ...Strings.auth.resetPassword,
                                                           buttons: ['Next'],
                                                       }
                                                   })
                                                   break
                                           }
                                       }} label={element} isLoading={idx === 0 && this.state.isLoading}
                                       style={{width: '80%', marginTop: idx === 0 ? '12.5%' : '5%'}}
                                       noBorder={idx === 1}/>
                    })
                }
            </View>
        );
    }

    async login() {
        let data = {
            "email": this.state.loginInfo.Email.toLowerCase(),
            "password": this.state.loginInfo.Password.toString(),
            "userRole": "EPO"
        }
        await Transport.Auth.login(data).then(async (res: any) => {
            if (res.data.success) {
                await Transport.User.profileDetails(res.data.token).then(async (resProfile: any) => {
                    if (resProfile.data?.data?.isVerified) {
                        addToSecureStore('token', res.data.token).finally(() => {
                            this.props.navigation.navigate('Main')
                            this.setState({
                                error: false,
                                errors: []
                            })
                        })
                    } else {
                        await Transport.Auth.sendOTP({
                            "email": this.state.loginInfo.Email.toLowerCase()
                        }).then((otpres: any) => {
                            if (otpres.data.success) {
                                this.setState({showVerification: true})
                            }
                        }).catch((err: any) => Alert.alert('OTP Error', err.message))
                    }
                }).catch((err: any) => Alert.alert('Error', err.message))
            } else {
                this.setState({error: true, errors: ["Email", "Password"]})
            }
        }).catch(() => {
            this.setState({error: true, errors: ["Email", "Password"]})
        })
    }

    async verifyCode(verifyData: any) {
        this.setState({isLoading: true})
        await Transport.Auth.verifyOTP(verifyData)
            .then(async (res: any) => {
                if (res.data.success) {
                    await addToSecureStore('token', res.data.token)
                        .finally(() => this.props.navigation.navigate('Main'))
                } else {
                    this.setState({error: true, codeValues: []})
                }
            })
            .catch(async (error: any) => Alert.alert('Verification Error', "Invalid Verification Code!"))
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

