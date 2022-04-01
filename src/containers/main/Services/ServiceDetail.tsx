import React from "react";
import {
    BackHandler,
    DeviceEventEmitter,
    Linking,
    Platform,
    SafeAreaView,
    ScrollView,
    Share,
    StyleSheet,
    Text,
    View
} from 'react-native'
import Colors from "../../../utils/colors";
import {FontAwesome} from "@expo/vector-icons";
import {Constants} from "../../../utils/constants";
import Strings from "../../../utils/strings";
import Button from "../../../components/Button";
import ErrorModal from "../../../components/errorModal";
import CustomModal from "../../../components/CustomModal";
import Card from "../../../components/Card";
import Counter from "../../../components/Counter";
import Transport from "../../../api/Transport";
import {getSecureStoreItem, isValidDate} from "../../../utils/CommonFunction";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    index: number;
    canceled: boolean;
    showCounter: boolean;
    moneyOffer: any;
}

export default class ServiceDetail extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            index: 0,
            canceled: false,
            showCounter: false,
            moneyOffer: 0.00
        }
    }

    handleBackButtonClick = () => {
        DeviceEventEmitter.emit('reloadServiceList')
        this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    dialCall = () => {

        let phoneNumber = '';

        if (Platform.OS === 'android') {
            phoneNumber = `tel:${+251994}`;
        } else {
            phoneNumber = `telprompt:${+251994}`;
        }

        Linking.openURL(phoneNumber).then(r => {
        });
    };

    sendSMS = () => {

        let SMS = '';

        if (Platform.OS === 'android') {
            SMS = `sms:${this.props.route.params.offerDetail.profile.phoneNumber}?body=This is a test message from the Watch Dogg`;
        } else {
            SMS = `sms:${this.props.route.params.offerDetail.profile.phoneNumber}&body=This is a test message from the Watch Dogg?`;
        }

        Linking.openURL(SMS).then(r => {
        });
    };

    render() {
        console.log("params",this.props.route.params)
        const {offerDetail} = this.props.route.params,
            status = offerDetail.status.toLowerCase(),
            Services = Strings.services

        if (this.state.moneyOffer === 0.00) {
            this.setState({moneyOffer: parseInt(offerDetail.offer.replace('$ ', ''))})
        }
        return (
            <ScrollView contentContainerStyle={{
                // flex: 1,
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor,}}>

                <ErrorModal
                    navigation={this.props.navigation}
                    modalVisible={this.state.canceled}
                    onRequestClose={(index: number) => {
                        if (index === 0) {
                            this.cancelRequest('Canceled', offerDetail).then(r => {
                            })
                        } else {
                            this.setState({canceled: false})
                            this.props.navigation.pop()
                        }
                    }}
                    style={{}}
                    errorMessage={Services.errorMessage}
                    idx={this.state.index}/>

                <CustomModal
                    navigation={this.props.navigation} modalVisible={this.state.showCounter}
                    onRequestClose={() => this.setState({showCounter: false})}
                    renderView={() => {
                        return (
                            <>
                                <Card cardViewContent={() => {
                                    return (
                                        <View style={{
                                            flexDirection: 'column',
                                            width: '100%',
                                            alignItems: 'center'
                                        }}>
                                            <Counter
                                                onValueEdited={(moneyOffer: number) => this.setState({moneyOffer})}
                                                onLeftPress={() => parseFloat(this.state.moneyOffer)-25>parseFloat(offerDetail.offer.replace('$ ',''))?this.setState({moneyOffer: parseFloat(this.state.moneyOffer) - 25}):null}
                                                onRightPress={() => this.setState({moneyOffer: parseFloat(this.state.moneyOffer) + 25})}
                                                label={this.state.moneyOffer}
                                                style={{width: '90%'}}/>

                                            <Button
                                                onPress={async () => {
                                                    try {
                                                        const result = await Share.share({
                                                            message: `I propose the offer should be : $ ${this.state.moneyOffer.toFixed(2)} \n Watch Dogg app \n https://expo.io/@mekuriyaworku/projects/Watch_Dogg`,
                                                        });
                                                        if (result.action === Share.sharedAction) {
                                                            if (result.activityType) {
                                                                // shared with activity type of result.activityType
                                                            } else {
                                                                this.setState({showCounter: false})
                                                            }
                                                        } else if (result.action === Share.dismissedAction) {
                                                            // dismissed
                                                        }
                                                    } catch (error) {
                                                        alert(error.message);
                                                    }
                                                }}
                                                label={Services.buttons[3]}
                                                isLoading={false}
                                                style={{height: 38,}}
                                                noBorder={false}
                                                disabled={false}/>
                                        </View>
                                             )
                                         }} height={undefined}
                                               width={undefined} style={{}}/>

                                         <Button
                                             onPress={async () => this.setState({showCounter: false})}
                                             label={Services.buttons[4]}
                                             isLoading={false}
                                             style={{backgroundColor: Colors.white, color: Colors.primaryColor}}
                                             noBorder={false}
                                             disabled={false}/>
                                     </>
                                 )
                             }} center={true} style={{}}/>


                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1,}}>
                    <View
                        style={{marginVertical: 55, flexDirection: 'row', paddingHorizontal: 32, alignItems: 'center'}}>
                        <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                     onPress={() => this.handleBackButtonClick()}/>
                        <Text allowFontScaling={false}
                            // @ts-ignore
                              style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                            {Services.headers[1]}</Text>
                    </View>
                    <View style={{marginHorizontal: 25}}>
                        {
                            [
                                {
                                    label: 'Client Full Name',
                                    value: offerDetail.clientName
                                },
                                {
                                    label: 'Service date',
                                    value: offerDetail.serviceDate
                                },
                                {
                                    label: 'Pick up address',
                                    value: offerDetail.pickUpAddress
                                },
                                {
                                    label: 'Notes',
                                    value: offerDetail.note
                                },
                                {
                                    label: 'Offer',
                                    value: offerDetail.offer
                                },
                            ].map((service: any, idx: number) => {
                                console.log("service",service)
                                return (
                                    <View key={idx} style={{
                                        flexDirection: 'row',
                                        borderBottomColor: Colors.gray,
                                        borderBottomWidth: Constants.borderWidth / 2,
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingVertical: 20
                                    }}>
                                        <View style={{width: idx === 0 ? '80%' : '100%'}}>
                                            <Text allowFontScaling={false}
                                                  style={{fontSize: 12, color: Colors.gray}}>{service.label}</Text>
                                            {
                                                idx === 1 ?
                                                    service.value.length > 0 &&
                                                    service.value.map((date: string) => {
                                                        return (
                                                            <Text allowFontScaling={false} // @ts-ignore
                                                                  style={{
                                                                      fontSize: 14,
                                                                      fontWeight: Constants.fontWeight,
                                                                      color: Colors.white
                                                                  }}>{isValidDate(date) ? new Date(date).toDateString() : date.toString()}</Text>
                                                        )
                                                    })
                                                    : <Text allowFontScaling={false} // @ts-ignore
                                                            style={{
                                                                fontSize: 14,
                                                                fontWeight: Constants.fontWeight,
                                                                color: Colors.white
                                                            }}>{service.value}</Text>
                                            }

                                        </View>
                                        {
                                            idx === 0 && status === "accepted" &&
                                            <View style={{
                                                width: '40%',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between'
                                            }}>
                                                {
                                                    Services.detailButtons.map((title: string, index: number) => {
                                                        return (
                                                            <Button key={index} onPress={() => {
                                                                switch (index) {
                                                                    case 0:
                                                                        this.sendSMS()
                                                                        break;
                                                                    case 1:
                                                                        this.dialCall()
                                                                        break;
                                                                }
                                                            }}
                                                                    label={title} isLoading={false}
                                                                    style={{width: '40%', height: 38}}
                                                                    noBorder={false} disabled={false}/>
                                                        )
                                                    })
                                                }
                                            </View>
                                        }
                                    </View>
                                )
                            })
                        }
                    </View>

                    {
                        status === "pending" &&
                        <View style={{
                            flexDirection: 'row',
                            width: '100%',
                            justifyContent: 'space-around',
                            // position: 'absolute',
                            // bottom: 95
                        }}>
                            {
                                Services.statusButtons.map((button: string, idx: number) => {
                                    return (
                                        <Button
                                            key={idx} onPress={() => {
                                            switch (idx) {
                                                case 0:
                                                    this.setState({canceled: true, index: 1})
                                                    break;
                                                case 1:
                                                    this.setState({showCounter: true})
                                                    break;
                                            }
                                        }}
                                            label={button} isLoading={false}
                                            style={{width: '40%'}} noBorder={false} disabled={false}/>
                                    )
                                })
                            }
                        </View>
                    }

                    {
                        status !== "canceled" &&
                        <Button onPress={async () => {
                            if (status === "accepted") {
                                this.setState({canceled: true})
                            } else {
                                await this.cancelRequest('Accepted', offerDetail)
                            }
                        }}
                                label={status === "accepted" ? Services.buttons[1] : Services.buttons[2]}
                                isLoading={false}
                                style={{width: '90%', marginVertical: 25}}
                                noBorder={false} disabled={false}/>
                    }

                </SafeAreaView>
            </ScrollView>
        );
    }

    async cancelRequest(status: string, offerDetail: any) {
        let data = {status},
            token = await getSecureStoreItem('token')

        Transport.Request.changeStatus(JSON.parse(token), offerDetail?.id, data)
            .then((res: any) => {
                if (res.data.code === 200) {
                    this.setState({canceled: false})
                    this.handleBackButtonClick()
                }
            })
            // .finally(() => this.setState({isLoading: false}))
            .catch((err: any) => console.log(err.message))
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

