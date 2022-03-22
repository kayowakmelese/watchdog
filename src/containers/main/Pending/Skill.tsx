import React from "react";
import {
    Alert,
    BackHandler,
    DeviceEventEmitter,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import Colors from "../../../utils/colors";
import {Entypo, FontAwesome} from "@expo/vector-icons";
import {Constants} from "../../../utils/constants";
import Button from "../../../components/Button";
import Transport from "../../../api/Transport";
import {getSecureStoreItem} from "../../../utils/CommonFunction";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    disabled: boolean;
    selectedOptions: any
}

export default class Skill extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            disabled: false,
            selectedOptions: []
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

        const {detail, selectedOptions} = this.props.route.params
        if (selectedOptions && this.state.selectedOptions.length === 0 && selectedOptions.length > 0) {
            this.setState({selectedOptions})
        }

        return (
            <ScrollView contentContainerStyle={{
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor,}}>
                <SafeAreaView style={{backgroundColor: Colors.primaryColor}}>
                    <View
                        style={{marginVertical: 55, flexDirection: 'row', paddingHorizontal: 32, alignItems: 'center'}}>
                        <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{paddingRight: 25}}
                                     onPress={() => {
                                         // DeviceEventEmitter.emit('changeIndex', {selectedOptions: this.state.selectedOptions})
                                         // this.props.navigation.goBack(this.state.selectedOptions)
                                         this.props.navigation.pop()
                                     }}/>
                        <Text allowFontScaling={false}
                            // @ts-ignore
                              style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                            {detail.header}</Text>
                    </View>
                    <View style={{width: '90%', marginHorizontal: '5%'}}>
                        {
                            detail.options.map((option: string, idx: number) => {
                                return (
                                    <View key={idx} style={{
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        marginVertical: 10
                                    }}>
                                        <Text allowFontScaling={false}
                                              style={{color: Colors.white, fontSize: 14}}>{option}</Text>
                                        <TouchableOpacity
                                            onPress={() => {
                                                let selectedOptions = this.state.selectedOptions
                                                let index = selectedOptions.indexOf(idx)
                                                if (index > -1) {
                                                    selectedOptions.splice(index, 1)
                                                } else {
                                                    selectedOptions.push(idx)
                                                }
                                                this.setState({selectedOptions})
                                            }}
                                            style={{
                                                width: 37,
                                                height: 37,
                                                borderWidth: Constants.borderWidth,
                                                borderColor: Colors.white,
                                                borderRadius: Constants.borderRadius / 2,
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                            {
                                                this.state.selectedOptions.indexOf(idx) > -1 &&
                                                <View style={{
                                                    height: 28, width: 28, backgroundColor: Colors.secondaryColor,
                                                    alignItems: 'center'
                                                }}>
                                                    <Entypo name="check" size={24} color={Colors.white}/>
                                                </View>
                                            }
                                        </TouchableOpacity>
                                    </View>
                                )
                            })
                        }
                    </View>
                    <Button onPress={async () => {
                        let token = await getSecureStoreItem('token'),
                            data: any = [];
                        this.state.selectedOptions.map((idx: number) => {
                            data.push(detail.options[idx])
                        })
                        this.updateSkill(JSON.parse(token), data).finally(() => this.setState({disabled: false}))
                    }}
                            label={'Submit'} isLoading={this.state.disabled}
                            style={{marginTop: '10%', width: '75%'}}
                            noBorder={false}
                            disabled={this.state.selectedOptions.length === 0}/>

                    <View style={{// height: 74,
                        padding: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#191919',
                        marginVertical: 50, borderRadius: Constants.borderRadius, marginHorizontal: '5%'
                    }}>
                        <Text allowFontScaling={false}
                              style={{color: Colors.white, fontSize: 16, paddingVertical: 12}}>{detail.title}</Text>
                        <Text allowFontScaling={false}
                              style={{color: Colors.gray, textAlign: 'justify'}}>{detail.subText}</Text>
                        <Button
                            onPress={() => {
                                this.props.navigation.navigate('Policy', {policy: detail, button: false})
                            }}
                            label={detail.button}
                            style={{
                                marginVertical: 25, backgroundColor: '#191919', borderWidth: 1,
                                borderColor: Colors.secondaryColor
                            }}
                            noBorder={false} disabled={false} isLoading={false}/>
                    </View>
                    {/*{*/}
                    {/*    this.state.selectedOptions.length === 3 &&*/}
                    {/*    (<>{DeviceEventEmitter.emit('changeIndex', {})}*/}
                    {/*        {this.props.navigation.goBack()}</>)*/}
                    {/*}*/}
                </SafeAreaView>
            </ScrollView>
        );
    }

    async updateSkill(token: string, data: any) {
        this.setState({disabled: true})
        await Transport.User.uploadDocuments(token, {skills: data})
            .then((res: any) => {
                if (res.data.success) {
                    Alert.alert("Success", `Skills updated!`, [
                        {
                            text: 'Continue',
                            onPress: () => {
                                DeviceEventEmitter.emit('changeIndex', {selectedOptions: this.state.selectedOptions})
                                this.props.navigation.navigate('Main')
                            }
                        }
                    ])
                } else {
                    Alert.alert("ERROR", "Couldn't update your skill!")
                }
            })
            .catch((error: any) => console.log(error))
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

