import React from "react";
import {ActivityIndicator, BackHandler, DeviceEventEmitter, StyleSheet, Text, View} from 'react-native'
import Colors from "../../../utils/colors";
import Strings from "../../../utils/strings";
import {Constants} from "../../../utils/constants";
import ServiceItem from "../../../components/ServiceItem";
import ServiceDetail from "./ServiceDetail";
import Transport from "../../../api/Transport";
import {getSecureStoreItem} from "../../../utils/CommonFunction";

export interface Props {
    navigation: any
}

interface State {
    request: any;
    requestActive: any;
    requestPending: any;
    requestCanceled: any;
    isLoading: boolean;
}

export default class Services extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            request: [],
            requestActive: [],
            requestPending: [],
            requestCanceled: [],
            isLoading: true
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        DeviceEventEmitter.addListener('reloadServiceList', (e: any) => {
            this.servicesList()
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    async componentDidMount() {
        await this.servicesList()
    }

    render() {
        const Services = Strings.services,
            Landing = Strings.home

        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1,}}>
                <View style={{marginTop: 55, flexDirection: 'row', paddingHorizontal: 32, alignItems: 'center'}}>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                        {Services.headers[0]}</Text>
                </View>

                {
                    this.state.isLoading ?
                        <ActivityIndicator size={'large'} color={Colors.secondaryColor} style={{paddingTop: '100%'}}/>
                        : <View style={{flex: 1, alignItems: 'center', marginVertical: 25}}>
                            {
                                this.state.request.length === 0 && !this.state.isLoading ?
                                    <Text allowFontScaling={false} style={{
                                        fontSize: 18,
                                        textAlign: 'center',
                                        paddingTop: '65%',
                                        color: Colors.gray
                                    }}>{Landing.next.noService}</Text>

                                    : this.state.request.map((offer: any, idx: number) => {
                                        return (
                                            <View key={idx} style={{width: '100%', alignItems: 'center'}}>
                                                <View style={{
                                                    height: 59,
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    backgroundColor: '#191919',
                                                    marginTop: 15,
                                                    width: '100%'
                                                }}>
                                                    <Text allowFontScaling={false}
                                                        // @ts-ignore
                                                          style={{
                                                              color: Colors.white,
                                                              fontSize: 14,
                                                              fontWeight: Constants.fontWeight
                                                          }}>{offer.title} {offer.eachData.length}</Text>
                                                </View>
                                                <View style={{width: '100%', marginVertical: 15}}>
                                                    {
                                                        offer.eachData.map((offerDetail: any, index: number) => {
                                                            return (
                                                                <ServiceItem key={index} navigation={this.props.navigation}
                                                                             onPress={() => this.props.navigation.navigate('ServiceDetail',
                                                                                 {offerDetail})}
                                                                             offerDetail={offerDetail}/>
                                                            )
                                                        })
                                                    }
                                                </View>
                                            </View>
                                        )
                                    })
                            }
                        </View>

                }

            </View>
        );
    }

    async servicesList() {
        this.setState({
            isLoading: true,
            request: [],
            requestActive: [],
            requestPending: [],
            requestCanceled: []
        })
        let token = await getSecureStoreItem('token'),
            request = await Transport.Request.getUserRequests(JSON.parse(token))
                .finally(() => this.setState({isLoading: false}))
                .catch((error: any) => console.log(error))
        if (request.data.status) {
            await Promise.all(
                request.data.data.map(async (item: any) => {
                    let itemDetail = {
                        id: item.id,
                        status: item.status,
                        startingDate: new Date(item.detail.serviceDate[0]).getDate() || item.detail.serviceDate,
                        clientName: item.profile.fullName,
                        serviceDate: item.detail.serviceDate,
                        pickUpAddress: item.pickupAddress.streetAddress ? `${item.pickupAddress?.streetAddress}, ${item.pickupAddress?.state}, ${item.pickupAddress?.city}` : " --- ",
                        note: item.detail.description,
                        durations: item.detail.serviceDate[0],
                        offer: '$ ' + item.hourlyOffer,
                        tip: '',
                        profile: item.profile
                    }
                    switch (item.status.toLowerCase()) {
                        case 'pending':
                            let requestPending = this.state.requestPending
                            requestPending.push(itemDetail)
                            this.setState({requestPending})
                            return;
                        case 'accepted':
                            let requestActive = this.state.requestActive
                            requestActive.push(itemDetail)
                            this.setState({requestActive})
                            return;
                        case 'canceled':
                            let requestCanceled = this.state.requestCanceled
                            requestCanceled.push(itemDetail)
                            this.setState({requestCanceled})
                            return;
                    }
                })
            ).catch(err => console.log(err))

            let requestList = []
            if (this.state.requestActive.length > 0) {
                requestList.push({
                    title: 'ACCEPTED: ',
                    eachData: this.state.requestActive
                })
            }
            if (this.state.requestPending.length > 0) {
                requestList.push({
                    title: 'PENDING: ',
                    eachData: this.state.requestPending
                })
            }
            if (this.state.requestCanceled.length > 0) {
                requestList.push({
                    title: 'CANCELED: ',
                    eachData: this.state.requestCanceled
                })
            }

            this.setState({request: requestList})
        }
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

