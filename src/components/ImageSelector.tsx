import React from "react";
import {BackHandler, DeviceEventEmitter, Platform, StyleSheet, Text, ToastAndroid as Toast, View} from 'react-native'
import Colors from "../utils/colors";
import Button from "../components/Button";
import {Constants} from "../utils/constants";
import CustomModal from "./CustomModal";
import Strings from "../utils/strings";
import Card from "./Card";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from 'expo-image-picker';
import {manipulateAsync} from "expo-image-manipulator";

export interface Props {
    header?: string;
    navigation: any;
    image: any;
    visible: boolean;
    onRequestClose: any;
}

interface State {
    PP: string,
    success: boolean
}

export default class ImageSelector extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            PP: '',
            success: false
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        DeviceEventEmitter.addListener('previewImage', (e: any) => {
            let PP = {
                "name": `photo_${Math.random()}`,
                "type": "*/*",
                "uri": e.photo.uri
            }
            this.props.image(PP)
        })
        DeviceEventEmitter.addListener('cameraCanceled', (e: any) => {
            this.props.onRequestClose()
        })
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }


    pickProfile = async () => {
        this.pickImage()
        // const result: any = await DocumentPicker.getDocumentAsync({type: "image/*"});

        // if (!result.cancelled) {
        //     if (result.uri !== undefined) {
        //         const PP: any = {
        //             // `uri` can also be a file system path (i.e. file://)
        //             uri: result.uri,
        //             name: result.name,
        //             type: "*/*"
        //         }
        //         this.props.image(PP)
        //         this.setState({PP})
        //     } else {
        //         if (Platform.OS !== 'ios') {
        //             Toast.show("Upload canceled by user!", Toast.CENTER)
        //         } else {
        //             alert("Upload canceled by user!")
        //         }
        //     }
        // } else {
        //     if (Platform.OS !== 'ios') {
        //         Toast.show("File upload error", Toast.CENTER)
        //     } else {
        //         alert("File upload error")
        //     }
        // }
    }
    private async pickImage(){
        // No permissions request is necessary for launching the image library
        const result:any = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
     
    
        if (!result.cancelled) {
            if (result.uri !== undefined) {
                let uris=result.uri.toString();
                uris=uris.split('/')
                const PP: any = {
                    // `uri` can also be a file system path (i.e. file://)
                    uri: result.uri,
                    name: uris[uris.length-1],
                    type: result.type
                }
                this.props.image(PP)
                this.setState({PP})
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
      };

    render() {
        return (
            <CustomModal
                navigation={this.props.navigation}
                modalVisible={this.props.visible}
                onRequestClose={() => this.props.onRequestClose()}
                renderView={() => {
                    return (
                        <>
                            <Card
                                cardViewContent={() => {
                                    return (
                                        <View
                                            style={{width: '100%', flexDirection: 'column'}}>
                                            <Text
                                                allowFontScaling={false}
                                                // @ts-ignore
                                                style={{
                                                    fontSize: 14, marginVertical: 20, textAlign: 'center',
                                                    fontWeight: Constants.fontWeight
                                                }}>{this.props.header || Strings.auth.profile.profilePicture.title}</Text>
                                            {
                                                Strings.auth.profile.profilePicture.buttons.map((element: string, idx: number) => {
                                                    return (
                                                        <Button
                                                            key={idx}
                                                            onPress={async () => {
                                                                switch (idx) {
                                                                    case 0:
                                                                        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
                                                                        if (!permissionResult.granted) {
                                                                            alert("You've refused to allow this app to access your camera!");
                                                                            return;
                                                                        }
                                                                        await ImagePicker.launchCameraAsync()
                                                                            .then(async (result: any) => {
                                                                                if (!result.cancelled) {
                                                                                    await manipulateAsync(result.uri,
                                                                                        [],
                                                                                        {compress: .5}
                                                                                    ).then((manipResult: any) => {
                                                                                        this.props.image({
                                                                                            uri: manipResult.uri,
                                                                                            type: '*/*',
                                                                                            name: new Date().getTime() + manipResult.uri.slice(-4)
                                                                                        })
                                                                                    });
                                                                                }
                                                                            })

                                                                        //TODO: for custom camera screen
                                                                        // @ts-ignore
                                                                        // this.props.navigation.navigate('CustomCamera')
                                                                        break;
                                                                    case 1:
                                                                        this.pickProfile().then(r => {
                                                                            this.props.onRequestClose()
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
                            <Button onPress={() => this.props.onRequestClose()}
                                    label={'Close'}
                                    isLoading={false}
                                    style={{backgroundColor: Colors.white, color: Colors.primaryColor}}
                                    noBorder={false} disabled={false}/>
                        </>
                    )
                }} center={false} style={{}}/>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

