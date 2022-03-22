import React from "react";
import {Alert, BackHandler, DeviceEventEmitter, StyleSheet, Text, View} from 'react-native'
import Colors from "../../utils/colors";
import {Constants} from "../../utils/constants";
import Numbers from "../../components/Number";
import Strings from "../../utils/strings";
import {FontAwesome} from "@expo/vector-icons";
import Button from "../../components/Button";
import ErrorModal from "../../components/errorModal";
import SuccessfulCard from "../../components/SuccessfulCard";
import Transport from "../../api/Transport";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    isLoading: boolean;
    success: boolean;
    isLogin: boolean;
    codeValues: any;
    error: boolean;
    disabled: boolean;
}

export default class Verification extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            isLoading: false,
            success: false,
            disabled: true,
            error: false,
            isLogin: false,
            codeValues: []
        }
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
        const {signupInfo} = this.props.route.params
        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1, paddingHorizontal: 32,}}>
                <ErrorModal navigation={this.props.navigation}
                            modalVisible={this.state.error}
                            onRequestClose={() => this.setState({error: false})}
                            style={{}}
                            errorMessage={Strings.auth.verification.errorMessage}
                            idx={0}/>

                <SuccessfulCard
                    successMessage={Strings.auth.verification.successMessage}
                    cardViewContent={undefined}
                    height={undefined}
                    width={undefined} style={{}}
                    navigation={this.props.navigation}
                    modalVisible={this.state.success}
                    onRequestClose={() => {
                        this.setState({success: false})
                        if (signupInfo.isResetPassword) {
                            let OTP: string = this.state.codeValues.join('')
                            let reset: any = Strings.auth.resetPassword
                            reset["passwordScreen"] = true
                            DeviceEventEmitter.emit('renderReset')
                            this.props.navigation.navigate('Reset', {reset, signupInfo, OTP})
                        } else {
                            this.props.navigation.navigate('Profile')
                        }
                    }}/>

                <View style={{marginTop: 55, flexDirection: 'row', alignItems: 'center'}}>
                    <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                 onPress={() => this.props.navigation.pop()}/>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                        {Strings.auth.verification.header}</Text>
                </View>
                <View style={{marginTop: '20%', marginBottom: '5%', marginLeft: 10}}>
                    <Text allowFontScaling={false}
                          style={{
                              marginBottom: 10,
                              fontSize: 14,
                              color: Colors.textColor_2
                          }}>{Strings.auth.verification.title}</Text>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{
                              marginBottom: 19,
                              fontSize: 14,
                              textAlign: 'left',
                              fontWeight: Constants.fontWeight,
                              color: Colors.white
                          }}>{signupInfo.Email}</Text>
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
                <View style={{alignItems: 'center', marginVertical: '12.5%'}}>
                    <Text allowFontScaling={false}
                          style={{
                              marginBottom: 10,
                              fontSize: 12,
                              color: Colors.textColor_2
                          }}>{Strings.auth.verification.subTitle}</Text>
                    {
                        Strings.auth.verification.buttons.map((element: string, idx: number) => {
                            return (
                                <Button key={idx} onPress={async () => {
                                    switch (idx) {
                                        case 0:
                                            let data = {"email": signupInfo.Email.toLowerCase()}
                                            this.resendOTP(data)
                                            break;
                                        case 1:
                                            this.setState({isLoading: true})
                                            let pass = this.state.codeValues
                                            let verifyData: any = {
                                                "email": signupInfo.Email.toLowerCase(),
                                                "otp": parseInt(pass.join(''))
                                            }
                                            this.verifyCode(verifyData)
                                            break;
                                    }
                                }} label={element} isLoading={this.state.isLoading && idx === 1} style={{}}
                                        noBorder={idx === 0}
                                        disabled={this.state.disabled && idx === 1}/>
                            )
                        })
                    }
                </View>
            </View>
        );
    }

    verifyCode(verifyData: any) {
        Transport.Auth.verifyOTP(verifyData)
            .then((res: any) => {
                if (res.data.success) {
                    this.setState({success: true})
                } else {
                    this.setState({error: true, codeValues: []})
                }
            })
            .catch((error: any) => {
                console.log(error)
                this.setState({error: true, codeValues: []})
            })
            .finally(() => this.setState({isLoading: false}))
    }

    resendOTP(data: { email: string }) {
        Transport.Auth.sendOTP(data)
            .then((res: any) => {
                Alert.alert('OTP Sent', res.data.message)
            })
            .catch(() => Alert.alert('Error', 'Could n\'t send OTP\nPlease try again.'))
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

