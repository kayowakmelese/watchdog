import React from "react";
import {ActivityIndicator, BackHandler, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Colors from "../../../utils/colors";
import {AntDesign} from "@expo/vector-icons";
import {Constants} from "../../../utils/constants";
import Strings from "../../../utils/strings";
import EarningItem from "../../../components/EarningItem";
import {formatMoney, getSecureStoreItem} from "../../../utils/CommonFunction";
import Transport from "../../../api/Transport";

export interface Props {
    navigation: any
}

interface State {
    isLoading: boolean;
    earnings: any;
    currentEarnings: string,
    totalEarnings: string,
    index: number
}

export default class Earnings extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            isLoading: true,
            currentEarnings: '0.00',
            totalEarnings: '0.00',
            earnings: [],
            index: 0
        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.pop();
        return true;
    };

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillMount() {
        this.getSelfEarning().then(r => {
        })
    }

    render() {
        const Earnings = Strings.earnings
        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1,}}>
                <View style={{marginTop: 55, flexDirection: 'row', paddingHorizontal: 32, alignItems: 'center'}}>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                        {Earnings.headers[0]}</Text>
                </View>

                <View style={{
                    height: 74,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#191919',
                    marginVertical: 25
                }}>
                    {
                        this.state.earnings.length === 0 ?
                            <Text allowFontScaling={false}
                                  style={{fontSize: 14, color: Colors.white}}>{Earnings.emptyMessage}</Text> :
                            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-evenly'}}>
                                <View style={{alignItems: 'center'}}>
                                    <Text allowFontScaling={false}
                                          style={{
                                              fontSize: 16,
                                              color: Colors.white
                                          }}>{`${Constants.months[new Date().getMonth()]} Earnings`}</Text>
                                    <Text allowFontScaling={false}
                                        // @ts-ignore
                                          style={{
                                              fontSize: 24,
                                              color: Colors.white,
                                              fontWeight: Constants.fontWeight
                                          }}>$ {formatMoney(this.state.currentEarnings)}</Text>
                                </View>
                                <View style={{alignItems: 'center'}}>
                                    <Text allowFontScaling={false}
                                          style={{fontSize: 16, color: Colors.white}}>{Earnings.lifeTime.month}</Text>
                                    <Text allowFontScaling={false}
                                        // @ts-ignore
                                          style={{
                                              fontSize: 23,
                                              color: Colors.white,
                                              fontWeight: Constants.fontWeight
                                          }}>$ {formatMoney(this.state.totalEarnings)}</Text>
                                </View>
                            </View>
                    }
                </View>
                {
                    this.state.isLoading ?
                        <ActivityIndicator size={'large'} color={Colors.secondaryColor}
                                           style={{paddingTop: '50%'}}/>
                        : this.state.earnings.length > 0 &&
                        <View style={{flex: 1, alignItems: 'center', marginVertical: 25}}>
                            {
                                // Earnings.lifeTime.descriptions
                                this.state.earnings.map((data: any, idx: number) => {
                                    if (this.state.index === idx)
                                        return (
                                            <View key={idx} style={{width: '100%', alignItems: 'center'}}>
                                                <View style={{
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between',
                                                    width: '95%'
                                                }}>
                                                    <Text allowFontScaling={false}
                                                        // @ts-ignore
                                                      style={{
                                                          color: Colors.white,
                                                          fontSize: 18,
                                                          fontWeight: Constants.fontWeight
                                                      }}>{data.year}</Text>
                                                <View style={{
                                                    width: '30%',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-evenly'
                                                }}>
                                                    {
                                                        Earnings.lifeTime.buttons.map((button: string, idx: number) => {
                                                            return (
                                                                <TouchableOpacity
                                                                    key={idx}
                                                                    onPress={() => {
                                                                        let index = this.state.index
                                                                        switch (idx) {
                                                                            case 0:
                                                                                index > 0 && this.setState({index: index - 1})
                                                                                break;
                                                                            case 1:
                                                                                Earnings.lifeTime.descriptions.length > index + 1 && this.setState({index: index + 1})
                                                                                break;
                                                                        }
                                                                    }}
                                                                    style={{
                                                                        backgroundColor: Colors.secondaryColor,
                                                                        justifyContent: 'center',
                                                                        borderRadius: Constants.borderRadius * 10,
                                                                        alignItems: 'center',
                                                                        width: 32,
                                                                        height: 32
                                                                    }}>
                                                                    <AntDesign // @ts-ignore
                                                                        name={button} size={20} color="white"/>
                                                                </TouchableOpacity>
                                                            )
                                                        })
                                                    }
                                                </View>
                                                </View>
                                                <View
                                                    style={{width: '100%', marginVertical: 15}}>
                                                    {
                                                        data.eachData.map((eventDetail: any, index: number) => {
                                                            return (
                                                                <EarningItem
                                                                    key={index}
                                                                    navigation={this.props.navigation}
                                                                    isEarning
                                                                    onPress={() => this.props.navigation.navigate('EarningDetail', {
                                                                        eventDetail: {
                                                                            ...eventDetail,
                                                                            month: Earnings.lifeTime.descriptions[idx].year
                                                                        }
                                                                    })}
                                                                    eventDetail={eventDetail}/>
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

    private async getSelfEarning() {
        let token = await getSecureStoreItem('token')
        Transport.Earnings.getEarnings(JSON.parse(token))
            .then(async (res: any) => {
                let earnings = res.data.data || [],
                    totalEarnings = res.data.totalEarnings,
                    currentEarnings = res.data.currentEarnings

                let groups: any = {};
                for (let i = 0; i < earnings.length; i++) {
                    let groupName = earnings[i].months;
                    if (!groups[groupName]) {
                        groups[groupName] = [];
                    }
                    groups[groupName].push({...earnings[i]});
                }
                earnings = [];
                for (let groupName in groups) {
                    earnings.push({year: groupName, eachData: [...groups[groupName]]});
                }

                this.setState({earnings, currentEarnings, totalEarnings})
            })
            .finally(() => this.setState({isLoading: false}))
            .catch((err: any) => console.log(err))
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

