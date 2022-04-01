import React from "react";
import {BackHandler, DeviceEventEmitter, SafeAreaView, StyleSheet, View} from 'react-native'
import Colors from "../utils/colors";
import AuthHeader from "../components/AuthHeader";
import Strings from "../utils/strings";
import Login from "../containers/auth/Login";
import SignUp from "../containers/auth/SignUp";
import * as linking from 'expo-linking'
import * as SecureStore from "expo-secure-store";
import jwtDecode from "jwt-decode";

export interface Props {
    navigation: any
}

interface State {
    isLogin: boolean;
    isInvitation:boolean;
    invitationCode:String;
}

export default class Auth extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            isLogin: true,
            isInvitation:false,
            invitationCode:""
        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        
        DeviceEventEmitter.addListener("renderLogin", (e) => {
            this.setState({isLogin: true})
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        linking.addEventListener("url",(event)=>{
            let data=linking.parse(event.url);
            console.log("thisisdata",JSON.stringify(data))
            this.checkSigned().finally(()=>{
                this.setState({isInvitation:true,invitationCode:data.queryParams.invitation,isLogin:false})
     
            });
              })
    }
    async checkSigned(){
        let secureStorage = await SecureStore.getItemAsync('isFirstTime')
        let token: any = await SecureStore.getItemAsync('token')
        if (secureStorage === 'True') {
            if (token !== null) {
                let decode: any = await jwtDecode(token)
                if (decode.isVerified) {
                    this.props.navigation.navigate('Main')
                } else {
                    // this.props.navigation.navigate('Auth')
                }
            } else {
                // this.props.navigation.navigate('Auth')
            }
        }
    }
    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <AuthHeader navigation={this.props.navigation} header={Strings.auth.header}
                                onSignUp={() => this.setState({isLogin: !this.state.isLogin})}
                                isLogin={this.state.isLogin}/>

                    {
                        this.state.isLogin && !this.state.isInvitation ?
                            <Login onSignUp={() => this.setState({isLogin: false})} navigation={this.props.navigation}
                                   loginData={Strings.auth.login}/>
                            : <SignUp navigation={this.props.navigation} goBack={() => this.setState({isLogin: true})}
                                      signupData={Strings.auth.signup} invitation={{isInvitation:this.state.isInvitation,invitationCode:this.state.invitationCode}}/>

                    }
                </SafeAreaView>
            </View>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

