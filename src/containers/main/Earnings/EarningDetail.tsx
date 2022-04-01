import React from "react";
import {BackHandler, SafeAreaView, ScrollView, StyleSheet, Text, View} from 'react-native'
// @ts-ignore
import {captureRef} from 'react-native-view-shot';
// @ts-ignore
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import Colors from "../../../utils/colors";
import {FontAwesome} from "@expo/vector-icons";
import {Constants} from "../../../utils/constants";
import Strings from "../../../utils/strings";
import Button from "../../../components/Button";
import SuccessfulCard from "../../../components/SuccessfulCard";
import * as Permissions from "expo-permissions";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    sent: boolean;
}

export default class EarningDetail extends React.Component<Props, State> {
    private _container: any;

    constructor(Props: any) {
        super(Props);
        this._container;
        this.state = {
            sent: false
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

    render() {
        console.log("insta",this.props.route.params)
        const {eventDetail} = this.props.route.params
        const Earnings = Strings.earnings

        return (
            <ScrollView contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor,}}>

                <SuccessfulCard
                    successMessage={Earnings.successMessage}
                    cardViewContent={undefined}
                    height={undefined}
                    width={undefined} style={{}}
                    navigation={this.props.navigation}
                    modalVisible={this.state.sent}
                    onRequestClose={() => {
                        this.setState({sent: false})
                        setTimeout(() => this.props.navigation.pop(), 250)
                    }}/>

                <SafeAreaView
                    style={{backgroundColor: Colors.primaryColor, flex: 1,}}>
                    <View
                        ref={view => {
                            this._container = view
                        }}
                        style={{backgroundColor: Colors.primaryColor, flex: 1,}}>

                        <View
                            style={{marginTop: 55, flexDirection: 'row', paddingHorizontal: 32, alignItems: 'center'}}>
                            <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                         onPress={() => this.props.navigation.pop()}/>
                            <Text allowFontScaling={false}
                                // @ts-ignore
                                  style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                                {Earnings.headers[1]}</Text>
                        </View>

                        <View style={{
                            height: 74,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: '#191919',
                            marginVertical: 25
                        }}>
                            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly'}}>
                                <View style={{alignItems: 'center'}}>
                                    <Text allowFontScaling={false}
                                          style={{fontSize: 16, color: Colors.white}}>{"Service Paid"}</Text>
                                    <Text allowFontScaling={false}
                                        // @ts-ignore
                                          style={{
                                              fontSize: 23,
                                              color: Colors.white,
                                              fontWeight: Constants.fontWeight
                                          }}>{eventDetail.detail.price}</Text>
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    <Text allowFontScaling={false}
                                          style={{fontSize: 16, color: Colors.white}}>{"Extra tip"}</Text>
                                    <Text allowFontScaling={false}
                                        // @ts-ignore
                                          style={{
                                              fontSize: 23,
                                              color: Colors.white,
                                              fontWeight: Constants.fontWeight
                                          }}>{eventDetail.detail.tip}</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{marginLeft: 20, marginVertical: 25}}>
                            <Text allowFontScaling={false} // @ts-ignore
                                  style={{
                                      fontSize: 16,
                                      fontWeight: Constants.fontWeight,
                                      color: Colors.white
                                  }}>{eventDetail.detail.name}</Text>
                            <Text allowFontScaling={false} style={{fontSize: 12, color: Colors.white}}>
                                Transaction date:
                                <Text allowFontScaling={false} // @ts-ignore
                                      style={{
                                          fontWeight: Constants.fontWeight,
                                          color: Colors.white
                                      }}> {eventDetail.month.split(' ')[0]} {eventDetail.date}</Text>
                            </Text>
                        </View>

                        <View style={{justifyContent: 'center', flexDirection: 'column'}}>
                            {
                                [
                                    {
                                        name: 'Services',
                                        value: eventDetail.detail.price
                                    },
                                    {
                                        name: 'Tips',
                                        value: eventDetail.detail.tip
                                    },
                                    {
                                        name: 'App Commission',
                                        value: '$ -10.90'
                                    },
                                    {
                                        name: 'Taxes',
                                        value: '$ -8.55'
                                    },
                                    {
                                        name: 'Total Earnings',
                                        value: '$ 109.00'
                                    },
                                ].map((element: any, idx: number) => {
                                    return (
                                        <View key={idx} style={{
                                            flexDirection: "row",
                                            justifyContent: 'space-between',
                                            borderColor: Colors.gray,
                                            borderBottomWidth: idx % 2 === 1 ? Constants.borderWidth / 2 : 0,
                                            marginHorizontal: 20,
                                            paddingVertical: 13
                                        }}>
                                            <Text allowFontScaling={false} // @ts-ignore
                                                  style={{
                                                      color: Colors.white,
                                                      fontSize: 14,
                                                      fontWeight: idx === 4 ? Constants.fontWeight : null
                                                  }}>{element.name}</Text>
                                            <Text allowFontScaling={false} // @ts-ignore
                                                  style={{
                                                      color: Colors.white,
                                                      fontSize: 16,
                                                      fontWeight: Constants.fontWeight
                                                  }}>{element.value}</Text>
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </View>
                    <Button
                        onPress={async () => await this.saveToCameraRollAsync()}
                        label={'Send Receipt'} isLoading={false} style={{position: 'absolute', bottom: 10}}
                        noBorder={false} disabled={false}/>
                </SafeAreaView>
            </ScrollView>
        );
    }

    saveToCameraRollAsync = async () => {
        let cameraRollUri = await captureRef(this._container, {format: 'png'});

        await Permissions.askAsync(
            Permissions.MEDIA_LIBRARY,
            Permissions.CAMERA
        ).finally(async () => {
            await Sharing.shareAsync(cameraRollUri)
                .then(async r => {
                    await MediaLibrary.saveToLibraryAsync(cameraRollUri)
                })
        });
    };
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

