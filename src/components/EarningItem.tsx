import React from "react";
import {BackHandler, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";

export interface Props {
    navigation: any;
    onPress: any;
    isEarning?: boolean;
    eventDetail: any;
}

interface State {
}

export default class EarningItem extends React.Component<Props, State> {

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
        const {onPress, eventDetail, isEarning} = this.props
        return (
            <TouchableOpacity
                onPress={() => onPress()}
                style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-evenly',
                    paddingVertical: 20,
                    marginVertical: 7.5,
                    borderBottomWidth: Constants.borderWidth,
                    borderColor: Colors.gray
                }}>
                <View style={{
                    flex: .15,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRightWidth: Constants.borderWidth * 3,
                    borderColor: Colors.white
                }}>
                    <Text allowFontScaling={false} // @ts-ignore
                          style={{
                              color: Colors.white,
                              fontWeight: Constants.fontWeight,
                              fontSize: 18
                          }}>{eventDetail.date}</Text>
                    <Text allowFontScaling={false} style={{
                        color: Colors.white,
                        fontSize: 12
                    }}>{eventDetail.day}</Text>
                </View>
                <View style={{flex: .70, paddingLeft: 20}}>
                    <Text allowFontScaling={false} // @ts-ignore
                          style={{
                              color: Colors.white,
                              fontWeight: Constants.fontWeight,
                              fontSize: 16
                          }}>{eventDetail.detail.name}</Text>
                    <Text allowFontScaling={false}
                          style={{color: Colors.white, fontSize: 12}}>{isEarning ? 'Status : ' : 'Offer : '}
                        <Text allowFontScaling={false}// @ts-ignore
                              style={{fontWeight: Constants.fontWeight}}> {isEarning ? eventDetail.detail.status : eventDetail.detail.hours}</Text>
                    </Text>
                </View>
                <View style={{
                    flex: .20,
                    alignItems: 'center',
                    justifyContent: 'space-evenly'
                }}>
                    <Text allowFontScaling={false} // @ts-ignore
                          style={{
                              color: Colors.white,
                              fontSize: 16,
                              fontWeight: Constants.fontWeight
                          }}>{eventDetail.detail.price}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

