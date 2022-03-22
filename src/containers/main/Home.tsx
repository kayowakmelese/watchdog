import React from "react";
import {ActivityIndicator, BackHandler, Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import * as SecureStore from "expo-secure-store";
import Colors from "../../utils/colors";
import {Constants} from "../../utils/constants";
import Strings from "../../utils/strings";
import Button from "../../components/Button";
import EarningItem from "../../components/EarningItem";
import {formatMoney, getSecureStoreItem} from "../../utils/CommonFunction";
import Transport from "../../api/Transport";

export interface Props {
    navigation: any;
    profileDetail: any;
}

interface State {
    idx: number;
    status: any;
    requestActive: any;
    isLoading: boolean;
    totalEarnings: string;
}

export default class Home extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            requestActive: [],
            isLoading: true,
            idx: 0,
            totalEarnings: '0.00',
            status: [
                {
                    color: 'green',
                    label: 'ACTIVE'
                },
                {
                    color: 'orange',
                    label: 'ON DUTY'
                },
                {
                    color: 'red',
                    label: 'DISCONNECTED'
                }]
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    async componentDidMount() {
        let isAllFileSubmitted = await SecureStore.getItemAsync('isAllFileSubmitted')
        if (isAllFileSubmitted === null) {
            await SecureStore.setItemAsync('isAllFileSubmitted', 'True')
        }
        await this.servicesList()
    }

    render() {

        const Landing = Strings.home,
            {profileDetail} = this.props

        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                <TouchableOpacity
                    onPress={() => this.props.navigation.navigate('MyProfile', {profileDetail})}
                    style={{marginVertical: 45, marginHorizontal: 25, flexDirection: 'row', alignItems: 'center'}}>
                    <Image resizeMode={'cover'} source={{uri: profileDetail.profilePicture}}
                           style={{width: 60, height: 60, borderRadius: 250}}/>
                    <View style={{marginHorizontal: 20, justifyContent: 'center'}}>
                        <Text allowFontScaling={false}         // @ts-ignore
                              style={{
                                  color: Colors.white,
                                  fontSize: 22,
                                  fontWeight: Constants.fontWeight
                              }}>{profileDetail.fullName}</Text>
                        <View>
                            <Text allowFontScaling={false}
                                  style={{color: Colors.white, fontSize: 12}}>{Landing.profile.button}</Text>
                        </View>
                    </View>
                </TouchableOpacity>
                <View style={{alignItems: 'center', marginBottom: 15}}>
                    <Text allowFontScaling={false}
                          style={{fontSize: 18, color: Colors.white}}>{Landing.overview.title}</Text>
                    <Text allowFontScaling={false}  // @ts-ignore
                          style={{
                              fontSize: 36,
                              color: Colors.white,
                              fontWeight: Constants.fontWeight
                          }}>$ {formatMoney(this.state.totalEarnings)}</Text>
                </View>

                <View style={{alignItems: 'center', marginVertical: 25}}>
                    {
                        Landing.buttons.map((button: string, idx) => {
                            return (
                                <Button key={idx} onPress={() => {
                                    switch (this.state.idx) {
                                        case 0:
                                            this.setState({idx: this.state.idx + 1})
                                            break;
                                        case 1:
                                            this.setState({idx: this.state.idx + 1})
                                            break;
                                        case 2:
                                            this.setState({idx: 0})
                                            break;

                                    }
                                }}
                                        label={this.state.status[this.state.idx].label}
                                        isLoading={false}
                                        style={{width: '75%', backgroundColor: this.state.status[this.state.idx].color}}
                                        noBorder={false} disabled={false}/>
                            )
                        })
                    }
                </View>
                <View>
                    <Text allowFontScaling={false} // @ts-ignore
                          style={{
                              fontSize: 16,
                              paddingVertical: 20,
                              paddingHorizontal: 20,
                              borderBottomWidth: Constants.borderWidth / 2,
                              borderColor: Colors.gray,
                              color: Colors.white,
                              fontWeight: Constants.fontWeight
                          }}>{Landing.next.title}</Text>

                    <View style={{marginHorizontal: 20}}>
                        {
                            this.state.isLoading ?
                                <ActivityIndicator size={'large'} color={Colors.secondaryColor}
                                                   style={{paddingTop: '50%'}}/>
                                :
                                this.state.requestActive.length === 0 && !this.state.isLoading ?

                                    <Text allowFontScaling={false} style={{
                                        fontSize: 18,
                                        textAlign: 'center',
                                        paddingTop: 100,
                                        color: Colors.gray
                                    }}>{Landing.next.noService}</Text> :
                                    this.state.requestActive.map((eventDetail: any, index: number) => {
                                        return (
                                            <EarningItem key={index} navigation={this.props.navigation}
                                                         onPress={() => {
                                                         }}
                                                         eventDetail={eventDetail}/>
                                        )
                                    })
                        }
                    </View>
                </View>
            </View>
        );
    }


    async servicesList() {
        this.setState({
            isLoading: true,
            requestActive: [],
        })
        let token = await getSecureStoreItem('token'),
            request = await Transport.Request.getUserRequests(JSON.parse(token))
                .finally(() => this.setState({isLoading: false}))
                .catch((error: any) => {
                    console.log(error);
                })
        if (request.data.status) {

            Transport.Earnings.getEarnings(JSON.parse(token))
            .then(async (res: any) => {
                let earnings = res.data.data || [],
                    totalEarnings = res.data.totalEarnings || '0.00',
                    currentEarnings = res.data.currentEarnings
                    this.setState({totalEarnings})
            })
            .catch((err: any) => console.log(err))

            let data = await Promise.all(
                request.data?.data &&
                request.data.data.length > 0 &&
                request.data.data.map(async (item: any) => {
                    let itemDetail = {
                        id: item.id,
                        status: item.status,
                        date: new Date(item.detail.serviceDate[0]).getDate() || item.detail.serviceDate[0],
                        day: Strings.home.days[new Date(item.detail.serviceDate[0]).getDay()],
                        detail: {
                            name: item.profile.fullName,
                            address: item.pickupAddress.streetAddress ? `${item.pickupAddress?.streetAddress}, ${item.pickupAddress?.state}, ${item.pickupAddress?.city}` : " --- ",
                            hours: '$ ' + item.hourlyOffer
                        },
                        profile: item.profile
                    }
                    switch (item.status.toLowerCase()) {
                        // case 'pending':
                        //     let requestPending = this.state.requestPending
                        //     requestPending.push(itemDetail)
                        //     this.setState({requestPending})
                        //     return;
                        case 'accepted':
                            let requestActive = this.state.requestActive
                            requestActive.push(itemDetail)
                            this.setState({requestActive})
                            return;
                        // case 'canceled':
                        //     let requestCanceled = this.state.requestCanceled
                        //     requestCanceled.push(itemDetail)
                        //     this.setState({requestCanceled})
                        //     return;
                    }
                })
            ).catch(err => console.log(err))
        }
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

