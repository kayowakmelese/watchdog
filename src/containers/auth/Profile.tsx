import React from "react";
import {
    Alert,
    BackHandler,
    DeviceEventEmitter,
    Image,
    Platform,
    StyleSheet,
    Text,
    ToastAndroid as Toast,
    View
} from 'react-native'
import Colors from "../../utils/colors";
import Button from "../../components/Button";
import {Constants} from "../../utils/constants";
import Strings from "../../utils/strings";
import CustomModal from "../../components/CustomModal";
import Card from "../../components/Card";
import * as DocumentPicker from 'expo-document-picker';
import * as Permissions from 'expo-permissions';
import SuccessfulCard from "../../components/SuccessfulCard";
import Transport from "../../api/Transport";
import {getSecureStoreItem, uploadFile} from "../../utils/CommonFunction";

export interface Props {
    route: any;
    navigation: any;
}

interface State {
    isLoading: boolean;
    setPP: boolean;
    PP: any;
    success: boolean;
}

export default class Profile extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            PP: '',
            isLoading: false,
            setPP: false,
            success: false
        }
    }

    handleBackButtonClick = () => {
        // this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        DeviceEventEmitter.addListener('previewImage', (e: any) => {
            let PP = {
                "name": `photo_${Math.random()}`,
                "type": "*/*",
                "uri": e.photo.uri
            }
            this.setState({PP, setPP: false})
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    pickProfile = async () => {
        const result: any = await DocumentPicker.getDocumentAsync({type: "image/*"});
        // alert(result.uri);
        if (!result.cancelled) {
            if (result.uri !== undefined) {
                const PP: any = {
                    // `uri` can also be a file system path (i.e. file://)
                    uri: result.uri,
                    name: result.name,
                    type: "*/*"
                }
                // let documents: any = this.state.documents
                // documents.push(PP)
                // this.state.documents.push(documents)
                this.setState({PP, setPP: false})
            } else {
                if (Platform.OS !== 'ios') {
                    Toast.show("Upload canceled by user!", Toast.CENTER)
                } else {
                    alert("Upload canceled by user!")
                }
            }
        } else {
            if (Platform.OS !== 'ios') {
                Toast.show("File upload error", Toast.CENTER)
            } else {
                alert("File upload error")
            }
        }
    }

    render() {
        return (
            <View style={{backgroundColor: Colors.primaryColor, paddingHorizontal: 25, flex: 1}}>
                <SuccessfulCard
                    successMessage={Strings.auth.profile.successMessage}
                    cardViewContent={undefined}
                    height={undefined}
                    width={undefined} style={{}}
                    navigation={this.props.navigation}
                    modalVisible={this.state.success}
                    onRequestClose={() => {
                        this.setState({success: false})
                        DeviceEventEmitter.emit('renderLogin')
                        this.props.navigation.navigate('Main')
                    }}/>

                <CustomModal navigation={this.props.navigation}
                             modalVisible={this.state.setPP}
                             onRequestClose={() => this.setState({setPP: false})}
                             renderView={() => {
                                 return (
                                     <>
                                         <Card cardViewContent={() => {
                                             return (
                                                 <View style={{width: '100%', flexDirection: 'column'}}>
                                                     <Text allowFontScaling={false}
                                                         // @ts-ignore
                                                           style={{
                                                               fontSize: 14, marginVertical: 20, textAlign: 'center',
                                                               fontWeight: Constants.fontWeight
                                                           }}>{Strings.auth.profile.profilePicture.title}</Text>
                                                     {
                                                         Strings.auth.profile.profilePicture.buttons.map((element: string, idx: number) => {
                                                             return (
                                                                 <Button key={idx} onPress={async () => {
                                                                     switch (idx) {
                                                                         case 0:
                                                                             this.setState({setPP: false})
                                                                             this.props.navigation.navigate('CustomCamera')
                                                                             break;
                                                                         case 1:
                                                                             this.pickProfile().then(r => {
                                                                             })
                                                                             break
                                                                     }
                                                                 }}
                                                                         label={element}
                                                                         isLoading={false}
                                                                         style={{}}
                                                                         noBorder={false}
                                                                         disabled={false}/>
                                                             )
                                                         })
                                                     }
                                                 </View>
                                             )
                                         }} height={undefined} width={undefined} style={{}}/>
                                         <Button onPress={() => this.setState({setPP: false})}
                                                 label={'Close'}
                                                 isLoading={false}
                                                 style={{backgroundColor: Colors.white, color: Colors.primaryColor}}
                                                 noBorder={false} disabled={false}/>
                                     </>
                                 )
                             }} center={false} style={{}}/>

                <Text allowFontScaling={false}
                    // @ts-ignore
                      style={{marginTop: '10%', color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                    {Strings.auth.profile.header}</Text>
                <View style={{marginTop: '12.5%', marginBottom: '5%'}}>
                    <Text allowFontScaling={false}
                        // @ts-ignore
                          style={{
                              marginBottom: 15,
                              fontSize: 18,
                              fontWeight: Constants.fontWeight,
                              color: Colors.white
                          }}>{Strings.auth.profile.title}</Text>
                    <Text allowFontScaling={false}
                          style={{
                              marginBottom: 19,
                              fontSize: 14,
                              textAlign: 'left',
                              color: Colors.white
                          }}>{Strings.auth.profile.subTitle}</Text>
                </View>
                <Image resizeMode={"cover"}
                       source={this.state.PP !== '' ? this.state.PP : require('../../assets/userIcon.png')}
                       style={{
                           height: 162,
                           width: 162,
                           marginVertical: 50,
                           borderRadius: Constants.radius * 100,
                           alignSelf: 'center'
                       }}/>
                {
                    Strings.auth.profile.buttons.map((element: string, idx: number) => {
                        return (
                            <Button key={idx} onPress={async () => {
                                switch (idx) {
                                    case 0:
                                        await Permissions.askAsync(
                                            Permissions.MEDIA_LIBRARY,
                                            Permissions.CAMERA
                                        ).finally(() => {
                                            this.setState({setPP: true})
                                        });
                                        break
                                    case 2:
                                        this.setState({success: true});
                                        break;
                                    default:
                                        if (this.state.PP === '') {
                                            Alert.alert('Warning', 'Please select a profile picture!');
                                        }
                                        await this.uploadProfile(this.state.PP).finally(() => {
                                            this.setState({isLoading: false})
                                        })
                                        break
                                }
                            }} label={element} isLoading={idx === 0 && this.state.isLoading}
                                    style={styles(idx).buttons}
                                    noBorder={idx === 2} disabled={false}/>
                        )
                    })
                }
            </View>
        );
    }

    async uploadProfile(PP: any) {
        this.setState({isLoading: true})
        let res: any = await uploadFile(PP),
            token = await getSecureStoreItem('token')
        if (res.status !== 201)
            Alert.alert('ERROR', 'Failed to upload image!')
        let profileUrl = {"profilePicture": res.body.postResponse.location || ''}

        Transport.User.updateProfile(JSON.parse(token), profileUrl)
            .then((response: any) => {
                if (response.data.success) {
                    this.setState({success: true})
                } else {
                    Alert.alert('ERROR', 'Unable to update your profile!')
                }
            }).catch((err: any) => alert('Unable to update your profile!' + err))
    }
}

const styles = (props: any) => {
    return StyleSheet.create({
        buttons: {
            width: props === 0 ? '60%' : '90%',
            position: 'relative',
            top: props !== 0 ? '25%' : 0,
            // @ts-ignore
            backgroundColor: props === 0 || props === 2 ? null : Colors.secondaryColor,
            // @ts-ignore
            borderWidth: props === 0 ? Constants.borderWidth : null, borderColor: Colors.white
        }
    });
};

