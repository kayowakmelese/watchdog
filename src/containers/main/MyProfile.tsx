import React from "react";
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    DeviceEventEmitter,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native'
import Colors from "../../utils/colors";
import {Constants} from "../../utils/constants";
import {Entypo, FontAwesome} from "@expo/vector-icons";
import Strings from "../../utils/strings";
import ImageSelector from "../../components/ImageSelector";
import ImagePreview from "../../components/ImagePreview";
import Transport from "../../api/Transport";
import {getSecureStoreItem, uploadFile} from "../../utils/CommonFunction";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    changeImage: boolean;
    profilePicture: string;
    index: number;
    images: any;
    profileImages: any;
    showFullScreen: boolean;
}


export default class MyProfile extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            index: 0,
            images: [],
            showFullScreen: false,
            changeImage: false,
            profilePicture: '',
            profileImages: ['profilePicture', 'passport', 'criminalRecord', 'driverLicence', 'watchDoggCertification', 'weaponCarrying']
        }
    }

    handleBackButtonClick = () => {
        DeviceEventEmitter.emit('reloadProfile')
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
        const MyProfile = Strings.settings.myProfile,
            {profileDetail} = this.props.route.params
           
        if (this.state.images.length === 0) {
            this.setState({
                images: [profileDetail.profilePicture || '', profileDetail.passport || '',
                    profileDetail.criminalRecord || '', profileDetail.driverLicence || '',
                    profileDetail.watchDoggCertification || '', profileDetail.weaponCarrying || '']
            })
        }

        return (
            <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>

                <ImagePreview
                    navigation={this.props.navigation}
                    bottomText={this.state.profileImages[this.state.index]}
                    imageUrl={this.state.images[this.state.index]}
                    isVisible={this.state.showFullScreen}
                    onChangeVisibility={() => this.setState({showFullScreen: false, index: 0})}/>

                <ImageSelector
                    navigation={this.props.navigation}
                    image={(image: any) => {
                        switch (this.state.index) {
                            case -1:
                                break
                            default:
                                this.setState({changeImage: false})
                                let images = this.state.images
                                images[this.state.index] = image.uri
                                this.changeProfileDetail(image, this.state.profileImages[this.state.index])
                                    .finally(() => {
                                        this.setState({images, index: 0, changeImage: false})
                                    })
                                break

                        }
                    }} visible={this.state.changeImage} onRequestClose={() => this.setState({changeImage: false})}/>

                <View style={{
                    marginTop: 50,
                    marginHorizontal: 25,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <FontAwesome
                            name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                            onPress={() => this.handleBackButtonClick()}/>
                        <Text allowFontScaling={false}
                            // @ts-ignore
                              style={{
                                  color: Colors.white,
                                  fontSize: 24,
                                  fontWeight: Constants.fontWeight
                              }}>{MyProfile.headers[0]}</Text>
                    </View>
                    {/*<TouchableOpacity onPress={() => {*/}
                    {/*    this.setState({changeImage: true, index: 0})*/}
                    {/*}} style={{}}>*/}
                    {/*    <Text allowFontScaling={false}*/}
                    {/*          style={{marginLeft: 15, color: Colors.white, fontSize: 14}}>{MyProfile.headers[1]}</Text>*/}
                    {/*</TouchableOpacity>*/}
                </View>

                <TouchableOpacity
                    onPress={() => this.setState({showFullScreen: true})}>
                    <Image
                        resizeMode={'cover'}
                        source={{uri: this.state.images[0]}}
                        style={{
                            width: 130,
                            height: 130,
                            alignSelf: 'center',
                            marginTop: 50,
                            marginBottom: 25,
                            borderRadius: Constants.borderRadius * 100
                        }}/>
                </TouchableOpacity>
                <Text
                    allowFontScaling={false}         // @ts-ignore
                    style={{
                        alignSelf: 'center',
                        color: Colors.white,
                        fontSize: 22,
                        paddingBottom: 15,
                        fontWeight: Constants.fontWeight,
                    }}>{profileDetail.fullName}</Text>

                <ScrollView>
                    <Text
                        allowFontScaling={false} style={{
                        color: Colors.gray,
                        width: '85%',
                        alignSelf: 'center',
                        textAlign: 'justify'
                    }}>{MyProfile.subTitle}</Text>

                    <View style={{borderBottomWidth: Constants.borderWidth / 4, borderColor: Colors.gray, margin: 10}}/>

                    <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-around', alignItems: 'center'}}>
                        {
                            MyProfile.abouts.map((about: string, idx: number) => {
                                return (
                                    <Text
                                        key={idx} allowFontScaling={false} style={{
                                        flex: 1 / 3,
                                        fontSize: 12,
                                        textAlign: 'center',
                                        color: Colors.white
                                    }}>{about}</Text>
                                )
                            })
                        }
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        flex: 1,
                        marginTop: 15,
                        justifyContent: 'space-around',
                        alignItems: 'center'
                    }}>
                        {
                            [profileDetail.height, profileDetail.weight, profileDetail.age].map((aboutData: string, idx: number) => {
                                return (
                                    <Text
                                        key={idx} allowFontScaling={false}
                                        // @ts-ignore
                                        style={{
                                            fontSize: 18,
                                            flex: 1 / 3,
                                            textAlign: 'center',
                                            color: Colors.white,
                                            fontWeight: Constants.fontWeight
                                        }}>{aboutData}</Text>
                                )
                            })
                        }
                    </View>

                    <View style={{
                        marginHorizontal: 15,
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        flexWrap: 'wrap',
                    }}>
                        {
                            this.state.images.length > 1 &&
                            this.state.images.map((image: any, idx: number) => {
                                if (idx > 0) {
                                    return (
                                        <View key={idx} style={{alignItems: 'center'}}>
                                            <TouchableOpacity
                                                onPress={() => this.setState({index: idx, showFullScreen: true})}>
                                                <Image
                                                    source={{uri: image}}
                                                    style={{width: 119, height: 119, marginVertical: 10}}/>
                                            </TouchableOpacity>
                                            <TouchableOpacity
                                                onPress={() => this.setState({index: idx, changeImage: true})}
                                                style={{
                                                    position: 'relative',
                                                    bottom: 25,
                                                    borderRadius: Constants.radius * 100,
                                                    borderColor: Colors.white,
                                                    borderWidth: Constants.borderWidth * 2,
                                                    backgroundColor: Colors.primaryColor,
                                                    justifyContent: 'center',
                                                    height: 35,
                                                    width: 35,
                                                    alignItems: 'center'
                                                }}>
                                                {this.state.changeImage && this.state.index === idx ?
                                                    <ActivityIndicator color={Colors.white} size={'small'}/> :

                                                    <Entypo name="pencil" size={20} color={Colors.white}
                                                            style={{alignSelf: 'center'}}/>
                                                }
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            })
                        }
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    async changeProfileDetail(image: any, label: any) {
        let token = await getSecureStoreItem('token')
        let res: any = await uploadFile(image);
        if (res.status !== 201)
            Alert.alert('ERROR', 'Failed to upload image!')
        if (label === 'profilePicture') {
            let response: any = await Promise.all([
                Transport.User.updateProfile(JSON.parse(token), {[label]: res.body.postResponse.location || ''})
            ]).catch((err: any) => alert('Unable to update your profile!'));
            if (response[0]) {
                this.handleResponse(response[0])
            }
        } else {
            let response: any = await Promise.all([
                Transport.User.uploadDocuments(JSON.parse(token), {[label]: res.body.postResponse.location || ''})
            ]).catch((err: any) => alert('Unable to update your profile!'));
            if (response[0]) {
                this.handleResponse(response[0])
            }
        }
    }

    handleResponse(response: any) {
        if (!response.data.success) {
            Alert.alert('ERROR', 'Unable to update your profile!')
        } else {
            Alert.alert('Success', 'Document Uploaded!')
        }
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

