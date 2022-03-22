import React from "react";
import {
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
import Colors from "../../../utils/colors";
import {AntDesign, FontAwesome} from "@expo/vector-icons";
import {Constants} from "../../../utils/constants";
import Button from "../../../components/Button";
import ImageSelector from "../../../components/ImageSelector";
import ImagePreview from "../../../components/ImagePreview";
import Transport from "../../../api/Transport";
import {camelize, getSecureStoreItem, uploadFile} from "../../../utils/CommonFunction";

export interface Props {
    navigation: any;
    route: any;
}

interface State {
    idx: number;
    index: any;
    showDoc: boolean;
    images: any;
    isLoading: boolean;
    showFullScreen: boolean;
}

export default class Documents extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            idx: -1,
            index: [],
            images: [],
            showDoc: false,
            isLoading: false,
            showFullScreen: false,
        }
    }

    handleBackButtonClick = () => {
        this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.setState({images:this.checkImages()})
    }
    checkImages=()=>{
        let paramss=this.props.route.params;
        let imagearr=[];
            if(paramss && paramss.profile){
                console.log("eatthat",paramss.detail.documents)
                if(paramss.detail.documents && paramss.detail.documents.length>2){
                    if(paramss.profile.driverLicence){
                        imagearr.push({uri:paramss.profile.driverLicence})
                    }
                    if(paramss.profile.criminalRecord){
                        imagearr.push({uri:paramss.profile.criminalRecord})
                    }
                    if(paramss.profile.passport){
                        imagearr.push({uri:paramss.profile.passport})
                    }
                }else if(paramss.detail.documents && paramss.detail.documents.length===2){
                     if(paramss.profile.weaponCarrying){
                         imagearr.push({uri:paramss.profile.weaponCarrying})
                     }
                     if(paramss.profile.watchDoggCertification){
                        imagearr.push({uri:paramss.profile.watchDoggCertification})
                    }
                }
               
            }
            console.log("imageArr",imagearr)
            return imagearr;
    }


    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        console.log("detaildocuments",this.props)
        const {detail, haveData} = this.props.route.params
        if (haveData && this.state.index.length === 0) {
            let index = []
            for (let i = 0; i < detail.documents.length; i++) {
                index.push(i)
            }
            this.setState({index})
        }
        return (
            
            <ScrollView contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor,}}>

                <ImagePreview navigation={this.props.navigation}
                              imageUrl={this.state.images.length > 0 && this.state.images[this.state.idx]}
                              isVisible={this.state.showFullScreen}
                              onChangeVisibility={() => this.setState({showFullScreen: false})}/>

                <ImageSelector navigation={this.props.navigation}
                               header={detail.uploadModal.title}
                               image={(image: any) => {
                                   if (image) {
                                       let index = this.state.index
                                       index.push(this.state.idx)
                                       let images = this.state.images
                                       images[this.state.idx] = image
                                       this.setState({index, images})
                                   }
                                   this.setState({showDoc: false})
                               }} visible={this.state.showDoc} onRequestClose={() => this.setState({showDoc: false})}/>

                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <View
                        style={{marginVertical: 55, flexDirection: 'row', paddingHorizontal: 32, alignItems: 'center'}}>
                        <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                     onPress={() => this.props.navigation.pop()}/>
                        <Text allowFontScaling={false}
                            // @ts-ignore
                              style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                            {detail.header}</Text>
                    </View>

                    <Text allowFontScaling={false}
                          style={{color: Colors.gray, textAlign: 'center'}}>{detail.title}</Text>
                    <View style={{marginTop: 40}}>
                        {
                            detail.documents.map((doc: any, idx: number) => {
                                return (
                                    <TouchableOpacity key={idx}
                                                      style={{
                                                          height: 58,
                                                          borderWidth: Constants.borderWidth / 2,
                                                          borderColor: Colors.gray,
                                                          marginHorizontal: 25,
                                                          marginVertical: 10,
                                                          borderRadius: Constants.borderRadius / 1.5,
                                                          flexDirection: 'row',
                                                          alignItems: 'center'
                                                      }} onPress={() => {
                                        if (idx === 0) {
                                            this.setState({showDoc: true, idx})
                                        } else {
                                            this.state.index.indexOf(idx - 1) > -1 && this.setState({
                                                showDoc: true,
                                                idx
                                            })
                                        }
                                    }}>
                                        <View style={{
                                            marginHorizontal: 25,
                                            flexDirection: 'row',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 26,
                                            width: 26,
                                            backgroundColor: this.state.index.indexOf(idx || 0) > -1 ? Colors.secondaryColor : Colors.gray,
                                            borderRadius: Constants.borderRadius * 100
                                        }}>
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
                                                      style={{color: Colors.gray}}>{doc.title}{this.state.index.indexOf(idx) > -1 ? 'edit' : 'upload'}</Text>
                                                <Text allowFontScaling={false}
                                                      style={{color: Colors.white}}>{doc.subTitle}</Text>
                                            </View>
                                            <AntDesign name="right" size={24} color={Colors.gray}
                                                       style={{alignSelf: 'center'}}/>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                    <ScrollView horizontal style={{paddingVertical: '15%', marginHorizontal: '5%'}}>
                        {
                            this.state.images.length > 0 &&
                            this.state.images.map((image: any, idx: number) => {
                                console.log("wewerehere",image)
                                return (
                                    // <TouchableOpacity key={idx} onPress={() => {
                                    //     let images = this.state.images
                                    //     images[idx] = images.file
                                    //     console.log(image)
                                    //     this.setState({idx,images, showFullScreen: true})
                                    //     console.log(this.state.images.length)
                                    //
                                    // }}>
                                    <Image source={image}
                                           style={{width: 150, marginHorizontal: 10, height: 150, padding: 25}}/>
                                    // </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                    <Button onPress={async () => {
                        this.setState({isLoading: true})
                        let documentTypes: any = [],
                            token = await getSecureStoreItem('token'),
                            files = this.state.images;

                        for (let i = 0; i < detail.documents.length; i++) {
                            let type = camelize(detail.documents[i].subTitle)
                            documentTypes.push(type)
                        }
                        let uploadResponses: any = await Promise.all(
                            files.map(async (file: any, i: number) => {
                                return await this.uploadProfile(file, documentTypes[i])
                            })
                        ).catch((err) => {
                            Alert.alert("ERROR", "Couldn't upload the documents!" + err.message)
                        })

                        let data = Object.assign({}, ...uploadResponses);
                        await this.updateProfileDetail(token, data)
                    }}
                            label={detail.button}
                            isLoading={this.state.isLoading}
                            style={{position: 'relative', marginTop: 10, bottom: 10, width: '90%'}}
                            noBorder={false}
                            disabled={this.state.index.length < detail.documents.length}/>
                </SafeAreaView>
            </ScrollView>
        );
    }

    async uploadProfile(PP: any, documentTypes: string) {
        let res: any = await uploadFile(PP)
        return {[documentTypes]: res.body.postResponse.location || ''}
    }

    updateProfileDetail(token: string, data: any) {
        Transport.User.uploadDocuments(JSON.parse(token), data)
            .then((res: any) => {
                if (res.data.success) {
                    Alert.alert("Success", `Document upload success!`, [
                        {
                            text: 'Continue',
                            onPress: () => {
                                DeviceEventEmitter.emit('changeIndex', {})
                                this.props.navigation.goBack()
                            }
                        }
                    ])
                } else {
                    Alert.alert("ERROR", "Couldn't upload the documents!")
                }
                this.setState({isLoading: false})
            })
            .catch((error: any) => {
                this.setState({isLoading: false})
                alert(error)
            })
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

