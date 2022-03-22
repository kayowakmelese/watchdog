import React from "react";
import {
    Alert,
    BackHandler,
    DeviceEventEmitter,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native'
import Colors from "../../../utils/colors";
import {AntDesign} from "@expo/vector-icons";
import {Constants} from "../../../utils/constants";
import Strings from "../../../utils/strings";
import Button from "../../../components/Button";
import CustomModal from "../../../components/CustomModal";
import Card from "../../../components/Card";
import CustomCheckBox from "../../../components/CustomCheckBox";
import Transport from "../../../api/Transport";
import {getSecureStoreItem} from "../../../utils/CommonFunction";

export interface Props {
    changeTab: any;
    navigation: any;
    profileDetail: any;
    refreshDetail: any;
    allFileSubmitted: any;
}

interface State {
    idx: number;
    rate: number;
    doneIndex: any;
    availability: string;
    selectedOptions: any;
    showAvailability: boolean;
    isCustom: boolean
}

export default class Pending extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            idx: 0,
            rate: 0,
            isCustom: false,
            doneIndex: [0],
            availability: '',
            selectedOptions: [],
            showAvailability: false
        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        return true;
    };

    changeIndex = (doneIndex: any = this.state.doneIndex, idx: number = this.state.idx) => {
        if (doneIndex.indexOf(idx) === -1) {
            doneIndex.push(idx)
        }
        this.setState({doneIndex})
    }

    async UNSAFE_componentWillMount() {
        DeviceEventEmitter.addListener('changeIndex', (e) => {
            this.changeIndex()
            this.setState({selectedOptions: e.selectedOptions})
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentDidMount() {
        this.props.refreshDetail()

        const {profileDetail} = this.props
        let secondCol = 0,
            thirdCol = 0

        Object.keys(profileDetail).map((key: string) => {
            let doneIndex = this.state.doneIndex
            switch (key) {
                case "passport":
                    if (profileDetail[key] !== "")
                        secondCol += 1
                    break;
                case "criminalRecord":
                    if (profileDetail[key] !== "")
                        secondCol += 1
                    break;
                case "driverLicence":
                    if (profileDetail[key] !== "")
                        secondCol += 1
                    break;
                case "weaponCarrying":
                    if (profileDetail[key] !== "")
                        thirdCol += 1
                    break;
                case "watchDoggCertification":
                    if (profileDetail[key] !== "")
                        thirdCol += 1
                    break;
                case "skills":
                    doneIndex.push(3)
                    break;

                default:
                    break;
            }
            if (secondCol === 3) {
                doneIndex.push(1)
            }
            if (thirdCol === 2) {
                doneIndex.push(2)
            }
            this.setState({doneIndex})
        })
    }

    componentWillUnmount() {
        this.props.refreshDetail()
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        console.log("detail",this.state)
        const Pending: any = Strings.home.pending

        return (
            <ScrollView contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor,}}>
                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <CustomModal navigation={this.props.navigation} modalVisible={this.state.showAvailability}
                                 onRequestClose={() => this.setState({showAvailability: false})}
                                 renderView={() => {
                                     return (
                                         <>
                                             <Card cardViewContent={() => {
                                                 return (
                                                     <View style={{width: '100%', flexDirection: 'column'}}>
                                                         <Text allowFontScaling={false}
                                                             // @ts-ignore
                                                               style={{
                                                                   fontSize: 14,
                                                                   marginVertical: 20,
                                                                   textAlign: 'center',
                                                                   fontWeight: Constants.fontWeight
                                                               }}>{// @ts-ignore
                                                             Pending.required[5].detail.headers[this.state.isCustom ? 1 : 0]}</Text>
                                                         {
                                                             !this.state.isCustom &&
                                                             Pending.required[5].detail.availability.map((availability: string, idx: number) => {
                                                                 return <Button key={idx}
                                                                                isCheckbox={this.state.isCustom}
                                                                                onPress={() => {
                                                                                    switch (idx) {
                                                                                        case 3:
                                                                                            this.setState({isCustom: true})
                                                                                            this.changeIndex()
                                                                                            break;
                                                                                        default:
                                                                                            this.setState({
                                                                                                availability,
                                                                                                showAvailability: false
                                                                                            })
                                                                                            this.changeIndex()
                                                                                            break;
                                                                                    }
                                                                                }}
                                                                                label={availability}
                                                                                isLoading={false} style={{}}
                                                                                noBorder={false} disabled={false}/>
                                                             })
                                                         }
                                                         {
                                                             this.state.isCustom &&
                                                             <CustomCheckBox
                                                                 onPress={(availability: any) => this.setState({availability: JSON.stringify(availability)})}
                                                                 items={Pending.required[5].detail.customize}
                                                                 style={{}}/>
                                                         }
                                                     </View>
                                                 )
                                             }} height={undefined} width={undefined} style={{}}/>
                                             <Button onPress={() => this.setState({
                                                 showAvailability: false,
                                                 isCustom: false
                                             })}
                                                     label={Pending.required[5].detail.button}
                                                     isLoading={false}
                                                     style={{backgroundColor: Colors.white, color: Colors.primaryColor}}
                                                     noBorder={false} disabled={false}/>
                                         </>
                                     )
                                 }} center={false} style={{}}/>

                    <View style={{
                        height: 76,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Colors.secondaryColor,
                        marginTop: 65,
                        width: '100%'
                    }}>
                        <Text allowFontScaling={false}
                              style={{color: Colors.white, fontSize: 14}}>{Pending.message}</Text>
                    </View>
                    <Text allowFontScaling={false}
                          style={{
                              textAlign: 'center',
                              marginVertical: 50,
                              color: Colors.gray,
                              fontSize: 14
                          }}>{Pending.title}</Text>
                    <View>
                        {
                            Pending.required.map((data: any, idx: number) => {
                                if (idx !== 4)
                                    return (
                                        <TouchableOpacity
                                            key={idx}
                                            style={[styles(this.props).menus]} onPress={() => {
                                            switch (idx) {
                                                case 0:
                                                    // this.props.navigation.navigate('MyProfile')
                                                    this.props.changeTab(3)
                                                    break;
                                                case 1:
                                                    this.state.doneIndex.indexOf(idx - 1) > -1 &&
                                                    this.props.navigation.navigate('Documents', {
                                                        detail: data.detail,
                                                        profile:this.props.profileDetail,
                                                        haveData: this.state.doneIndex.indexOf(idx) > -1
                                                    })
                                                    break;
                                                case 2:
                                                    this.state.doneIndex.indexOf(idx - 1) > -1 &&
                                                    this.props.navigation.navigate('Documents', {
                                                        detail: data.detail,
                                                        profile:this.props.profileDetail,
                                                        haveData: this.state.doneIndex.indexOf(idx) > -1
                                                    })
                                                    break;
                                                case 3:
                                                    this.state.doneIndex.indexOf(idx - 1) > -1 &&
                                                    this.props.navigation.navigate('Skill', {
                                                        detail: data.detail,
                                                        selectedOptions: this.state.selectedOptions
                                                    })
                                                    break;
                                                case 5:
                                                    this.state.doneIndex.indexOf(idx - 2) > -1 &&
                                                    this.setState({showAvailability: true})
                                                    break;
                                            }
                                            this.setState({idx})
                                        }}>
                                            <View style={{alignItems: 'center'}}>
                                                {/*<Text allowFontScaling={false} style={{color: Colors.white, paddingBottom: 5}}>{'Step'}</Text>*/}
                                                <View style={styles(this.state.doneIndex.indexOf(idx)).order}>
                                                    <Text allowFontScaling={false}
                                                          style={{color: Colors.white, fontSize: 13}}>{idx + 1}</Text>
                                                </View>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                width: '75%'
                                            }}>
                                                <View>
                                                    <Text allowFontScaling={false}
                                                          style={{color: Colors.white}}>{data.title}</Text>
                                                    <Text allowFontScaling={false}
                                                          style={{color: Colors.gray}}>{idx === 5 ? this.state.availability : data.subTitle}</Text>
                                                </View>
                                                {
                                                    idx !== 5 &&
                                                    <AntDesign name="right" size={24} color={Colors.gray}
                                                               style={{alignSelf: 'center'}}/>
                                                }
                                            </View>
                                        </TouchableOpacity>
                                    )
                                return (
                                    <View>
                                        <View style={[styles(this.props).menus]}>
                                            <View style={styles(this.state.doneIndex.indexOf(idx)).order}>
                                                <Text allowFontScaling={false}
                                                      style={{color: Colors.white, fontSize: 13}}>{idx + 1}</Text>
                                            </View>
                                            <View style={{
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                width: '75%'
                                            }}>
                                                <View>
                                                    <Text allowFontScaling={false}
                                                          style={{color: Colors.white}}>{data.title}</Text>
                                                    <Text allowFontScaling={false}
                                                          style={{color: Colors.gray}}>{data.subTitle}</Text>
                                                </View>
                                                <View style={{
                                                    alignItems: 'center',
                                                    flexDirection: 'row',
                                                    justifyContent: 'space-between'
                                                }}>
                                                    <TouchableOpacity
                                                        disabled={this.state.doneIndex.indexOf(idx - 1) === -1}
                                                        style={{paddingHorizontal: 5}}
                                                        onPress={() => {
                                                            if (this.state.rate > 1) {
                                                                this.setState({rate: this.state.rate - 25, idx: 4})
                                                                this.changeIndex(this.state.doneIndex, 4)
                                                            }
                                                        }}>
                                                        <Text allowFontScaling={false}
                                                              style={{color: Colors.white, fontSize: 17}}>{'-'}</Text>
                                                    </TouchableOpacity>
                                                    <TextInput
                                                        value={"$ " + this.state.rate}
                                                        keyboardType={'decimal-pad'}
                                                        maxLength={9}
                                                        editable={this.state.doneIndex.indexOf(idx - 1) > -1}
                                                        onChangeText={(value) => {
                                                            if (value.length > 2) {
                                                                this.setState({
                                                                    rate: parseInt(value.replace('$ ', '')),
                                                                    idx: 4
                                                                })
                                                            } else {
                                                                this.setState({rate: 0, idx: 4})
                                                            }
                                                            this.changeIndex(this.state.doneIndex, 4)
                                                        }}
                                                        allowFontScaling={false}
                                                        style={{color: Colors.white, marginHorizontal: 25}}/>
                                                    <TouchableOpacity
                                                        disabled={this.state.doneIndex.indexOf(idx - 1) === -1}
                                                        style={{paddingHorizontal: 5}}
                                                        onPress={() => {
                                                            this.setState({rate: this.state.rate + 25, idx: 3})
                                                            this.changeIndex(this.state.doneIndex, 4)
                                                        }}>
                                                        <Text allowFontScaling={false}
                                                              style={{color: Colors.white, fontSize: 17}}>{'+'}</Text>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                )
                            })
                        }
                        {
                            this.state.doneIndex.indexOf(5) > -1 &&
                            <Button onPress={async () => {
                                let token = await getSecureStoreItem('token');
                                this.state.doneIndex.indexOf(5) > -1 && this.completeProfile(JSON.parse(token), this.state)
                            }}
                                    label={'Submit Form'}
                                    isLoading={false}
                                    style={{width: '80%', marginVertical: 30}}
                                    noBorder={false}
                                    disabled={false}/>
                        }
                    </View>
                </SafeAreaView>
            </ScrollView>
        );
    }

    completeProfile(token: string, state: Readonly<State>) {
        let data = {
            hourlyRate: state.rate,
            availability: state.availability
        }
        if (this.state.rate === 0) {
            Alert.alert('Error', 'Hourly rate can not be $ 0.00')
        } else {
            Transport.User.uploadDocuments(token, data)
                .then((res: any) => {
                    if (res.data.success) {
                        Alert.alert("Done!", `Profile submission completed!`, [
                            {
                                text: 'Continue',
                                onPress: () => {
                                    this.props.allFileSubmitted()
                                }
                            }
                        ])
                    } else {
                        Alert.alert("ERROR", "Couldn't submit your profile!")
                    }
                })
                .catch((error: any) => console.log(error))
        }
    }
}

const styles = (index: any) => {
    return StyleSheet.create({
        menus: {
            height: 58,
            borderWidth: Constants.borderWidth / 2,
            borderColor: Colors.gray,
            marginHorizontal: 25,
            marginVertical: 10,
            borderRadius: Constants.borderRadius / 1.5,
            flexDirection: 'row',
            alignItems: 'center'
        },
        order: {
            marginHorizontal: 25,
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            height: 26,
            width: 26,
            backgroundColor: index > -1 ? Colors.secondaryColor : Colors.gray,
            borderRadius: Constants.borderRadius * 100
        }
    });
};

