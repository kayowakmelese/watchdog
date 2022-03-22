import React from "react";
import {ActivityIndicator, BackHandler, Image, SafeAreaView, StyleSheet, Text, View} from 'react-native'
import Colors from "../utils/colors";
import AppIntroSlider from "react-native-app-intro-slider";
import Strings from "../utils/strings";
import {Constants} from "../utils/constants";
import Button from "../components/Button";
import * as SecureStore from "expo-secure-store";
import CustomModal from "../components/CustomModal";
import jwtDecode from "jwt-decode";

export interface Props {
    navigation: any
}

interface State {
    isLoading: boolean;
}

export default class Intro extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            isLoading: true
        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        let secureStorage = await SecureStore.getItemAsync('isFirstTime')
        let token: any = await SecureStore.getItemAsync('token')
        if (secureStorage === 'True') {
            if (token !== null) {
                let decode: any = await jwtDecode(token)
                if (decode.isVerified) {
                    this.props.navigation.navigate('Main')
                } else {
                    this.props.navigation.navigate('Auth')
                }
            } else {
                this.props.navigation.navigate('Auth')
            }
        }
        this.setState({isLoading: false})
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    _renderItem = ({item}: any) => {
        return (
            <View style={{flex: 1}}>
                <Text allowFontScaling={false}
                    // @ts-ignore
                      style={{
                          fontSize: 24, fontWeight: Constants.fontWeight, textAlign: 'center',
                          color: Colors.white
                      }}>{item.title}</Text>
                <Text allowFontScaling={false} style={{
                    textAlign: 'center',
                    fontSize: 14,
                    color: Colors.textColor,
                    margin: '7.5%'
                }}>{item.subtitle}</Text>
            </View>
        );
    }
    _renderNextButton = () => {
        return (
            <View
                // @ts-ignore
                style={{
                    width: '95%', marginVertical: 10, height: 48, alignItems: 'center', justifyContent: 'center',
                    borderRadius: Constants.borderRadius, backgroundColor: Colors.secondaryColor, alignSelf: 'center',
                    flexDirection: 'row', position: 'relative', bottom: 25
                }}>
                <Text
                    // @ts-ignore
                    style={{
                        color: Colors.white,
                        fontWeight: Constants.fontWeight,
                        textAlign: 'right',
                        fontSize: 14,
                    }}>{'Next'}</Text>
            </View>
        );
    };
    _renderSkipButton = () => {
        return (
            <Button onPress={() => this.isFirstTime()} label={Strings.intro.buttons[1]} isLoading={false}
                    style={{position: 'relative', bottom: 25}} noBorder disabled={false}/>
        );
    };
    _renderDoneButton = () => {
        return (
            <Button onPress={() => this.isFirstTime()} label={Strings.intro.buttons[2]} isLoading={false}
                    style={{marginBottom: 78}} noBorder={false}
                    disabled={false}/>
        );
    };

    isFirstTime = async () => {
        await SecureStore.setItemAsync('isFirstTime', 'True')
            .finally(() => this.props.navigation.navigate('Auth'))
    }

    render() {
        if (this.state.isLoading)
            return <CustomModal
                navigation={this.props.navigation}
                modalVisible={this.state.isLoading}
                onRequestClose={() => {
                }}
                renderView={() => {
                    return (
                        // <Image source={require('../../assets/splash.png')}
                        //     resizeMode={'contain'} style={{width: '100%'}}/>
                        <ActivityIndicator size={'large'} color={Colors.secondaryColor}
                                           style={{paddingTop: '100%'}}/>
                    )
                }} center={true}
                style={{backgroundColor: Colors.primaryColor, height: '100%', borderRadius: 0}}/>
        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <View style={{flex: 1.25, alignItems: 'center', justifyContent: 'center'}}>
                        <Image resizeMode={"center"} source={require('../assets/logo.png')}
                               style={{height: '75%', width: '75%'}}/>
                    </View>
                    <AppIntroSlider
                        data={Strings.intro.contents}
                        bottomButton
                        showSkipButton
                        activeDotStyle={{backgroundColor: Colors.secondaryColor, position: 'relative', bottom: -150}}
                        dotStyle={{
                            borderWidth: Constants.borderWidth,
                            borderColor: Colors.gray,
                            position: 'relative',
                            bottom: -150
                        }}
                        renderDoneButton={this._renderDoneButton}
                        renderNextButton={this._renderNextButton}
                        renderSkipButton={this._renderSkipButton}
                        renderItem={this._renderItem}/>
                </SafeAreaView>
            </View>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};
