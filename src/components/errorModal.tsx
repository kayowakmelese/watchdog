import React from "react";
import {BackHandler, StyleSheet, Text, View} from 'react-native'
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import CustomModal from "./CustomModal";
import Button from "./Button";

export interface Props {
    navigation: any,
    modalVisible: boolean;
    onRequestClose: any;
    style: any;
    errorMessage: any;
    idx: number
}

interface State {
}

export default class ErrorModal extends React.Component<Props, State> {

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
        return (
            <CustomModal
                style={{backgroundColor: Colors.white, width: '85%'}}
                navigation={this.props.navigation}
                modalVisible={this.props.modalVisible}
                onRequestClose={() => this.props.onRequestClose()}
                renderView={() => {
                    return (
                        <View>
                            <Text allowFontScaling={false}
                                // @ts-ignore
                                  style={{textAlign: 'center', fontWeight: Constants.fontWeight, fontSize: 18}}>
                                {this.props.errorMessage.title}
                            </Text>
                            <Text
                                allowFontScaling={false}
                                style={{textAlign: 'center', marginVertical: 15, fontSize: 14}}
                            >{this.props.errorMessage.messages[this.props.idx || 0]}</Text>

                            {
                                this.props.errorMessage.button &&
                                <Button onPress={() => this.props.onRequestClose()}
                                        label={this.props.errorMessage.button}
                                        isLoading={false}
                                        style={{}}
                                        noBorder={false}
                                        disabled={false}/>
                            }
                            {
                                this.props.errorMessage.buttons &&
                                (
                                    <>
                                        {
                                            this.props.errorMessage.buttons.map((button: string, idx: number) => {
                                                return (
                                                    <Button key={idx} onPress={() => {
                                                        this.props.onRequestClose(idx)
                                                    }} label={button} isLoading={false}
                                                            style={{
                                                                color: idx === 1 ? 'black' : 'white',
                                                                marginBottom: idx === 1 ? 0 : null
                                                            }} noBorder={idx === 1} disabled={false}/>
                                                )
                                            })
                                        }
                                    </>
                                )
                            }
                        </View>
                    )
                }} center/>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

