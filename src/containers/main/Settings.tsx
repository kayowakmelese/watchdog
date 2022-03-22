import React from "react";
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    DeviceEventEmitter,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import Colors from "../../utils/colors";
import {AntDesign, Entypo, MaterialIcons} from "@expo/vector-icons";
import {Constants} from "../../utils/constants";
import Strings from "../../utils/strings";
import Button from "../../components/Button";
import ErrorModal from "../../components/errorModal";
import ImageSelector from "../../components/ImageSelector";
import ImagePreview from "../../components/ImagePreview";
import {getSecureStoreItem, removeSecureStoreItem, uploadFile} from "../../utils/CommonFunction";
import Transport from "../../api/Transport";
import * as Permissions from "expo-permissions";

export interface Props {
    navigation: any;
    profileDetail: any;
    refreshDetail: any;
}

interface State {
    signOut: boolean;
    changePP: boolean;
    uploading: boolean;
    profilePicture: string;
    showFullScreen: boolean;
}

export default class Settings extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            signOut: false,
            changePP: false,
            profilePicture: '',
            uploading: false,
            showFullScreen: false
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        DeviceEventEmitter.addListener('reloadProfile', (e: any) => {
            this.props.refreshDetail()
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        this.props.refreshDetail()
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    async uploadProfile(PP: any) {
        this.setState({uploading: true, changePP: false})
        let res: any = await uploadFile({...PP, type: '*/*'}),
            token = await getSecureStoreItem('token')
        if (res.status !== 201)
            Alert.alert('ERROR', 'Failed to upload image!')
        let profileUrl = {"profilePicture": res.body.postResponse.location || ''}
        Transport.User.updateProfile(JSON.parse(token), profileUrl)
            .then((response: any) => {
                if (response.data.success) {
                    this.props.refreshDetail()
                    Alert.alert('Success', 'Profile changed!')
                    this.setState({profilePicture: res.body.postResponse.location || ''})
                } else {
                    Alert.alert('ERROR', 'Unable to update your profile!')
                }
                this.setState({uploading: false})
            })
            .catch((err: any) => Alert.alert('ERROR', 'Unable to update your profile!'))

        this.props.refreshDetail()
    }

    render() {
        const {profileDetail} = this.props,
            Settings = Strings.settings

        return (
            <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>

                <ImagePreview
                    navigation={this.props.navigation}
                    imageUrl={profileDetail.profilePicture}
                    isVisible={this.state.showFullScreen}
                    onChangeVisibility={() => this.setState({showFullScreen: false})}/>

                <ImageSelector
                    navigation={this.props.navigation}
                    image={(profilePicture: any) => this.uploadProfile(profilePicture)}
                    visible={this.state.changePP}
                    onRequestClose={() => this.setState({changePP: false})}/>

                <ErrorModal
                    navigation={this.props.navigation}
                    modalVisible={this.state.signOut}
                    onRequestClose={async (index: number) => {
                        if (index === 0) {
                            this.setState({signOut: false})
                            await Promise.all([
                                removeSecureStoreItem('token'),
                                removeSecureStoreItem('isAllFileSubmitted')
                            ]).finally(() => this.props.navigation.navigate('Auth'))
                        } else {
                            this.setState({signOut: false})
                        }
                    }}
                    style={{}}
                    errorMessage={Settings.errorMessage}
                    idx={0}/>

                <View style={{
                    marginTop: 50,
                    marginHorizontal: 25,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                        {Settings.headers[0]}</Text>

                    <TouchableOpacity
                        onPress={() => this.props.navigation.navigate('Reset', {
                            reset: {
                                headers: ['Support'],
                                isSetting: true,
                                forms: [{
                                    title: `Do you have any questions or complaints?`,
                                    label: `Support`,
                                    hint: `We need security to transport us and protect us while we do our shopping in Atlanta malls for a couple of hours.`,
                                    type: 'default',
                                    multiline: true
                                }],
                                buttons: ['Send'],
                                errorMessage: Settings.warning,
                                successMessage: {
                                    messages: 'Your message has\n' +
                                        'been sent',
                                    button: 'Continue'
                                }
                            }
                        })}
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            borderWidth: Constants.borderWidth,
                            borderRadius: Constants.borderRadius,
                            borderColor: Colors.white,
                            paddingVertical: 5,
                            paddingHorizontal: 10
                        }}>
                        <MaterialIcons name="support-agent" size={24} color={Colors.white}/>
                        <Text allowFontScaling={false}
                            // @ts-ignore
                              style={{
                                  marginLeft: 15,
                                  color: Colors.white,
                                  fontSize: 14,
                                  fontWeight: Constants.fontWeight
                              }}>{Settings.headers[1]}</Text>
                    </TouchableOpacity>

                </View>
                <View style={{alignItems: 'center'}}>
                    <TouchableOpacity onPress={() => this.setState({showFullScreen: true})}>
                        <Image resizeMode={'cover'}
                               source={
                                   this.state.profilePicture === '' ? profileDetail.profilePicture !== "" ?
                                       {uri: profileDetail.profilePicture} :
                                       require("../../assets/userIcon.png") : {uri: this.state.profilePicture}}
                               style={{
                                   width: 130,
                                   height: 130,
                                   alignSelf: 'center',
                                   marginTop: 65,
                                   marginBottom: 35,
                                   borderRadius: Constants.borderRadius * 100
                               }}/>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={async () => {
                            const {status} = await Permissions.getAsync(Permissions.CAMERA, Permissions.MEDIA_LIBRARY);
                            if (status !== 'granted') {
                                await Permissions.askAsync(
                                    Permissions.MEDIA_LIBRARY,
                                    Permissions.CAMERA
                                )
                            } else {
                                this.setState({changePP: true})
                            }
                        }}
                        disabled={this.state.uploading}
                        style={{
                            position: 'relative',
                            bottom: 55,
                            borderRadius: Constants.radius * 100,
                            backgroundColor: Colors.white,
                            justifyContent: 'center',
                            height: 35,
                            width: 35,
                            alignItems: 'center'
                        }}>
                        {
                            this.state.uploading ?
                                <ActivityIndicator size={'small'} color={Colors.secondaryColor}/>
                                : <Entypo name="pencil" size={20} color={Colors.primaryColor}
                                          style={{alignSelf: 'center'}}/>
                        }
                    </TouchableOpacity>
                </View>
                <View style={{}}>
                    {
                        this.profile(profileDetail).map((menu: any, idx: number) => {
                            return (
                                <View key={idx}>
                                    <TouchableOpacity
                                        key={idx}
                                        onPress={() => {
                                            switch (idx) {
                                                case 1:
                                                    break;
                                                case 3:
                                                    this.props.navigation.navigate('MyProfile', {profileDetail})
                                                    break;
                                                case 4:
                                                    this.props.navigation.navigate('Invite')
                                                    break;
                                                case 5:
                                                    this.props.navigation.navigate('Policy', {
                                                        policy: Strings.policy.terms,
                                                        button: false
                                                    })
                                                    break;
                                                case 6:
                                                    this.props.navigation.navigate('Policy', {
                                                        policy: Strings.policy.privacy,
                                                        button: false
                                                    })
                                                    break;
                                                case 7:
                                                    this.props.navigation.navigate('Policy', {
                                                        policy: Strings.policy.faq,
                                                        button: false
                                                    })
                                                    break;
                                                default:
                                                    this.props.navigation.navigate('Reset', {
                                                        reset: {
                                                            headers: [menu.label],
                                                            isSetting: true,
                                                            forms: [{
                                                                title: `You can edit your ${menu.label} by writing a new one`,
                                                                label: `${menu.label.trim()}`,
                                                                hint: `${menu.value}`,
                                                                type: menu.label === 'Phone Number' ? 'phone-pad' : menu.label === 'Email' ? 'email-address' : 'default',
                                                            }],
                                                            buttons: ['Next'],
                                                            errorMessage: Settings.warning,
                                                            successMessage: Settings.successMessage
                                                        }
                                                    })
                                                    break
                                            }
                                        }}
                                        style={{
                                            borderBottomWidth: this.profile(profileDetail).length - 1 === idx ? 0 : Constants.borderWidth / 2,
                                            borderColor: Colors.gray,
                                            paddingVertical: 7.5,
                                            flexDirection: 'row',
                                            justifyContent: 'space-between',
                                            marginVertical: 10,
                                            marginHorizontal: 25
                                        }}
                                    >
                                        <Text allowFontScaling={false}
                                              style={{fontSize: 12, color: Colors.white}}>{menu.label}</Text>
                                        <View style={{flexDirection: 'row', alignItems: 'center'}}>
                                            <Text allowFontScaling={false}
                                                // @ts-ignore
                                                  style={{
                                                      fontSize: 12,
                                                      marginRight: 15,
                                                      color: Colors.white,
                                                      fontWeight: Constants.fontWeight
                                                  }}>
                                                {menu.value || ''}
                                            </Text>
                                            <AntDesign name="right" size={15} color="white"/>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            )
                        })
                    }

                    <Button onPress={() => this.setState({signOut: true})} label={Settings.buttons[0]}
                            isLoading={false}
                            style={{width: '80%', marginVertical: 45}}
                            noBorder={false}
                            disabled={false}/>

                </View>
            </SafeAreaView>
        );
    }

    profile(profileDetail: any) {
        return [
            {
                label: 'Full Name',
                value: profileDetail.fullName
            },
            {
                label: 'Email Address',
                value: profileDetail.email
            },
            {
                label: 'Phone Number',
                value: profileDetail.phoneNumber
            },
            {
                label: 'My Profile',
            },
            {
                label: 'Invite a friend',
            },
            {
                label: 'Terms & Conditions',
            },
            {
                label: 'Privacy Policy',
            },
            {
                label: 'FAQ’S'
            }
        ]
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

