import React from "react";
import {ActivityIndicator, Alert, BackHandler, SafeAreaView, ScrollView, StyleSheet, View} from 'react-native'
import Colors from "../utils/colors";
import Footer from "../components/Footer";
import Services from "../containers/main/Services/Services";
import Earnings from "../containers/main/Earnings/Earnings";
import Settings from "../containers/main/Settings";
import Pending from "../containers/main/Pending/Pending";
import * as SecureStore from "expo-secure-store";
import ErrorModal from "../components/errorModal";
import Home from "../containers/main/Home";
import {addToSecureStore, getSecureStoreItem, removeSecureStoreItem} from "../utils/CommonFunction";
import Transport from "../api/Transport";

export interface Props {
    navigation: any
}

interface State {
    profileDetail: any;
    allFileSubmitted: boolean;
    modalVisible: boolean;
    isLoading: boolean;
    currentTab: number;
    exit: boolean;
}

export default class Main extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            profileDetail: {},
            allFileSubmitted: false,
            modalVisible: false,
            isLoading: true,
            currentTab: 0,
            exit: false
        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        this.setState({exit: true})
        return true;
    };

    async UNSAFE_componentWillMount() {
        let isAllFileSubmitted = await SecureStore.getItemAsync('isAllFileSubmitted')
        if (isAllFileSubmitted?.toLowerCase() === 'true') {
            this.setState({allFileSubmitted: true, isLoading: false})
        }
        await this.getUserProfile();
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        this.setState({currentTab: 0})
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    async getUserProfile() {
        let token = await getSecureStoreItem('token')
        if (token !== null) {
            Transport.User.profileDetails(JSON.parse(token))
                .then(async (res: any) => {
                    if (res.data.status) {
                        const profileDetail = res.data.data,
                            allFileSubmitted = res.data.data.availability && res.data.data.passport
                        let usersExponentPushToken = profileDetail.exponentPushToken
                        let exponentPushToken = await getSecureStoreItem('exponentPushToken')
                        if (exponentPushToken) {
                            if (usersExponentPushToken.indexOf(JSON.parse(exponentPushToken)) === -1) {
                                usersExponentPushToken.push(JSON.parse(exponentPushToken))
                                this.addUserDevices(token, usersExponentPushToken)
                            }
                        }
                        this.setState({profileDetail, allFileSubmitted, isLoading: false})
                        addToSecureStore('isAllFileSubmitted', allFileSubmitted).then(r => {
                        })
                    }
                }).finally(() => this.setState({isLoading: false}))
                .catch((err: any) => Alert.alert('Error', `Can not find user detail \n ${err}`, [
                    {
                        style: 'default',
                        text: 'Re-Login',
                        onPress: async () => {
                            await removeSecureStoreItem('token').then(async () => {
                                await removeSecureStoreItem('isAllFileSubmitted').finally(() => {
                                    this.props.navigation.navigate('Auth')
                                })
                            })
                        }
                    }
                ]))
        }
    }

    render() {
        if (this.state.isLoading) {
            return (
                <View style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <ActivityIndicator size={'large'} color={Colors.secondaryColor} style={{paddingTop: '100%'}}/>
                </View>
            )
        }
        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <ScrollView showsVerticalScrollIndicator={false} style={{marginBottom: 55}}>
                        {
                            this.changeView(this.state.currentTab, this.props.navigation)
                        }
                    </ScrollView>
                    <Footer currentTab={this.state.currentTab}
                            isActive={!this.state.allFileSubmitted}
                            activeTab={async (currentTab: number) => {
                                if (currentTab === 3) {
                                    await this.getUserProfile()
                                }
                                this.setState({currentTab})
                            }}/>
                    <ErrorModal
                        navigation={this.props.navigation}
                        modalVisible={this.state.exit}
                        onRequestClose={(index: number) => {
                            if (index === 0) {
                                this.setState({exit: false})
                                this.props.navigation.goBack()
                            } else {
                                this.setState({exit: false})
                            }
                        }}
                        style={{}}
                        errorMessage={{
                            title: 'Warning',
                            messages: ['Are you sure you want to exit\n' +
                            'from Watch Dogg?'],
                            buttons: ['Yes, Exit', 'Close']
                        }}
                        idx={0}/>
                </SafeAreaView>
            </View>
        );
    }

    changeView(currentTab: number, navigation: any) {
        switch (currentTab) {
            case 0:
                if (this.state.allFileSubmitted)
                    return <Home navigation={navigation} profileDetail={this.state.profileDetail}/>
                return <Pending changeTab={(tab: number) => this.setState({currentTab: tab})}
                                allFileSubmitted={() => {
                                    this.changeView(0, this.props.navigation)
                                    this.setState({allFileSubmitted: true})
                                }} refreshDetail={async () => await this.getUserProfile()}
                                profileDetail={this.state.profileDetail} navigation={navigation}/>
            case 1:
                return <Services navigation={navigation}/>
            case 2:
                return <Earnings navigation={navigation}/>
            case 3:
                return <Settings navigation={navigation} profileDetail={this.state.profileDetail}
                                 refreshDetail={async () => await this.getUserProfile()}/>
        }
    }

    addUserDevices(token: any, exponentPushToken: any) {
        Transport.User.updateProfile(JSON.parse(token), {
            exponentPushToken: exponentPushToken.filter((x: string, i: string, a: any) => a.indexOf(x) == i)
        }).catch((err: any) => console.log(err))
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

