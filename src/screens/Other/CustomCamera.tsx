import React from "react";
import {BackHandler, DeviceEventEmitter, Image, SafeAreaView, TouchableOpacity, View} from 'react-native'
// @ts-ignore
import {Camera} from 'expo-camera';
import Colors from "../../utils/colors";
import {Entypo, MaterialCommunityIcons, MaterialIcons} from "@expo/vector-icons";
import {Constants} from "../../utils/constants";
import Button from "../../components/Button";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    photo: any;
    flash: string;
    focusable: boolean;
    type: any;
    isDisabled: boolean;
}

export default class CustomCamera extends React.Component<Props, State> {
    camera: any;

    constructor(Props: any) {
        super(Props);
        this.camera = null
        this.state = {
            isDisabled: false,
            type: Camera.Constants.Type.front,
            photo: null,
            flash: 'off',
            focusable: false
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        return (
            <SafeAreaView
                style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                <View
                    style={{
                        height: '10%',
                        width: '40%',
                        alignSelf: 'center',
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'space-around'
                    }}>
                    <Entypo
                        name="flash" size={24}
                        color={this.state.flash === 'off' ? Colors.white : Colors.secondaryColor}
                        onPress={() => this.setState({flash: this.state.flash === 'on' ? 'off' : 'on'})}/>
                    <MaterialCommunityIcons
                        name="focus-field" size={24}
                        color={this.state.focusable ? Colors.secondaryColor : Colors.white}
                        onPress={() => this.setState({focusable: !this.state.focusable})}/>
                    <MaterialIcons
                        name="flip-camera-android" size={24} color={
                        this.state.type === Camera.Constants.Type.front ? Colors.white : Colors.secondaryColor}
                        onPress={() => {
                            if (this.state.type === Camera.Constants.Type.back) {
                                this.setState({
                                    type: Camera.Constants.Type.front
                                })
                            } else {
                                this.setState({
                                    type: Camera.Constants.Type.back
                                })
                            }
                        }}/>
                </View>
                {
                    this.state.photo === null ?
                        <Camera
                            ref={(r) => {
                                this.camera = r
                            }}
                            style={{flex: 1, backgroundColor: Colors.white}}
                            // @ts-ignore
                            flashMode={this.state.flash}
                            focusable={this.state.focusable}
                            type={this.state.type}/>
                        : <Image source={this.state.photo} style={{width: '100%', height: '75%'}}/>
                }
                <View style={{
                    height: '15%', width: '100%', alignSelf: 'center', alignItems: 'center', flexDirection: 'row',
                    justifyContent: 'space-between'
                }}>
                    {
                        this.state.photo === null ?
                            <>
                                <Button
                                    onPress={() => {
                                        DeviceEventEmitter.emit('cameraCanceled', {})
                                        this.props.navigation.pop()
                                    }}
                                    label={'Back'}
                                    isLoading={false} style={{width: 100, color: Colors.secondaryColor}}
                                    noBorder disabled={false}/>

                                <TouchableOpacity
                                    disabled={this.state.isDisabled}
                                    style={{
                                        position: 'absolute',
                                        right: '42%',
                                        alignSelf: 'center',
                                        borderRadius: Constants.radius * 10,
                                        zIndex: 1,
                                        justifyContent: 'center',
                                        width: 72,
                                        height: 72,
                                        backgroundColor: this.state.isDisabled ? Colors.white : Colors.secondaryColor
                                    }}
                                    onPress={async () => {
                                        this.setState({isDisabled: true})
                                        let photo = await this.camera.takePictureAsync()
                                        this.setState({photo, isDisabled: false})
                                        this.camera.pausePreview()
                                    }}>
                                    <View
                                        style={{
                                            alignSelf: 'center',
                                            borderRadius: Constants.radius * 10,
                                            zIndex: 1,
                                            position: 'relative',
                                            justifyContent: 'center',
                                            width: 60,
                                            height: 60,
                                            backgroundColor: Colors.primaryColor
                                        }}>
                                        <View
                                            style={{
                                                alignSelf: 'center',
                                                borderRadius: Constants.radius * 10,
                                                zIndex: 1,
                                                position: 'relative',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                width: 47,
                                                height: 47,
                                                backgroundColor: this.state.isDisabled ? Colors.white : Colors.secondaryColor
                                            }}/>
                                    </View>
                                </TouchableOpacity>
                            </> : <View
                                style={{position: 'absolute', left: '20%', width: '60%'}}>
                                {
                                    ['Select Image', 'RETRY'].map((element: string, idx: number) => {
                                        return (
                                            <Button
                                                key={idx}
                                                onPress={() => {
                                                    switch (idx) {
                                                        case 0:
                                                            DeviceEventEmitter.emit('previewImage', {photo: this.state.photo})
                                                            this.props.navigation.pop()
                                                            break;
                                                        case 1:
                                                            this.setState({photo: null})
                                                            break;
                                                    }
                                                }}
                                                label={element}
                                                isLoading={false}
                                                style={{}}
                                                noBorder={idx === 1}
                                                disabled={false}/>
                                        )
                                    })
                                }
                            </View>
                    }

                </View>
            </SafeAreaView>
        );
    }
}