import React from "react";
import {BackHandler, StyleSheet, Text} from 'react-native'
import Colors from "../utils/colors";
import ImageViewer from 'react-native-image-zoom-viewer';
import CustomModal from "./CustomModal";
import {decamelize} from "../utils/CommonFunction";
import {Constants} from "../utils/constants";

export interface Props {
    navigation: any;
    imageUrl: any;
    bottomText?: string;
    isVisible: boolean;
    onChangeVisibility: any;
}

interface State {
}

export default class ImagePreview extends React.Component<Props, State> {

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
        return (
            <CustomModal
                navigation={this.props.navigation}
                modalVisible={this.props.isVisible}
                onRequestClose={() => this.props.onChangeVisibility()}
                renderView={() => {
                    return (
                        <>
                            <ImageViewer
                                enableSwipeDown
                                onSwipeDown={() => this.props.onChangeVisibility()}
                                imageUrls={
                                    [
                                        {
                                            url: this.props.imageUrl,
                                            props: {
                                                source: this.props?.imageUrl || require('../assets/userIcon.png')
                                            }
                                        }
                                    ]
                                }/>
                            {
                                this.props.bottomText &&
                                <Text                     // @ts-ignore
                                    style={{
                                        color: 'white',
                                        fontWeight: Constants.fontWeight,
                                        alignSelf: 'center',
                                        fontSize: 20
                                    }}>{decamelize(this.props.bottomText, ' ')}</Text>
                            }
                        </>
                    )
                }} center={true}
                style={{height: '100%', backgroundColor: Colors.primaryColor}}/>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

