import React from "react";
import {BackHandler, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import {AntDesign} from "@expo/vector-icons";
import Strings from "../utils/strings";

export interface Props {
    navigation: any;
    onPress: any;
    offerDetail: any;
}

interface State {
}

export default class ServiceItem extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {}
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
        const {onPress, offerDetail} = this.props,
            status = offerDetail.status.toLowerCase(),
            Services = Strings.services
        return (
            <TouchableOpacity
                onPress={() => onPress()}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    paddingVertical: 20,
                    marginVertical: 7.5,
                    borderBottomWidth: Constants.borderWidth / 2,
                    borderColor: Colors.gray
                }}>
                {
                    status === "accepted" &&
                    <View style={{
                        flex: .10,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderColor: Colors.white
                    }}>
                        <Text allowFontScaling={false} // @ts-ignore
                              style={{
                                  color: Colors.white,
                                  fontWeight: Constants.fontWeight,
                                  fontSize: 18
                              }}>{offerDetail.startingDate}</Text>
                        <Text allowFontScaling={false} style={{
                            color: Colors.white,
                            fontSize: 12
                        }}>{Strings.home.days[new Date(offerDetail.serviceDate[0]).getDay()]}</Text>
                    </View>
                }
                <View style={{flex: status === "accepted" ? .70 : .80, paddingLeft: 5}}>
                    <Text allowFontScaling={false} // @ts-ignore
                          style={{
                              color: Colors.white,
                              fontWeight: Constants.fontWeight,
                              fontSize: 16
                          }}>{offerDetail.clientName}</Text>
                    <Text allowFontScaling={false} style={{
                        color: Colors.white,
                        fontSize: 12
                    }}>{`${status === "accepted" ? 'Pick up address: ' : 'Client has made an offer: '}`}
                        <Text allowFontScaling={false}// @ts-ignore
                              style={{fontWeight: Constants.fontWeight}}> {status === "accepted" ? offerDetail.pickUpAddress : offerDetail.offerPrice}</Text>
                    </Text>
                    <Text allowFontScaling={false}
                          style={{
                              color: Colors.white,
                              fontSize: 12
                          }}>{`${status === "accepted" ? 'Worked Offer: ' : 'Service date: '}`}
                        <Text allowFontScaling={false}// @ts-ignore
                              style={{fontWeight: Constants.fontWeight}}> {status === "accepted" ? offerDetail.offer : offerDetail.serviceDate[0]}</Text>
                    </Text>
                </View>
                <View
                    style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text allowFontScaling={false}
                          style={{
                              color: status.toLowerCase() == "pending" ? Colors.pending :
                                  status.toLowerCase() == "accepted" ?
                                      Colors.active : Colors.secondaryColor, fontSize: 13
                          }}>{'Detail'}</Text>
                    <AntDesign name="right" size={18}
                               color={status.toLowerCase() == "pending" ? Colors.pending : status.toLowerCase() == "accepted" ?
                                   Colors.active : Colors.secondaryColor}/>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

