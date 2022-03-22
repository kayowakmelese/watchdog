import React from "react";
import {BackHandler, StyleSheet, Text, TouchableOpacity, View} from 'react-native'
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import {Feather} from "@expo/vector-icons";

export interface Props {
    noBorder?: any;
    onPress: any;
    items: any;
    style: any;
}

interface State {
    idx: any,
    selectedItems: any
}

export default class CustomCheckBox extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            idx: [],
            selectedItems: []
        }
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
            <>
                {
                    this.props.items.map((checkItem: string, idx: number) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    let items = this.props.items
                                    let index = this.state.idx
                                    let selectedItems = this.state.selectedItems
                                    if (index.indexOf(idx) === -1) {
                                        index.push(idx)
                                        selectedItems.push(items[idx])
                                    } else {
                                        index.splice(index.indexOf(idx), 1)
                                        selectedItems.splice(selectedItems.indexOf(items[idx]), 1)
                                    }
                                    this.setState({idx: index, selectedItems})
                                    this.props.onPress(selectedItems)
                                }} key={idx} style={[styles(this.state, idx).buttonStyle, this.props.style]}>
                                {
                                    (!this.props?.noBorder || (this.props?.noBorder)) &&
                                    (
                                        <>
                                            <Text allowFontScaling={false}
                                                // @ts-ignore
                                                  style={[{
                                                      flex: .5,
                                                      color: this.state.idx.indexOf(idx) >= 0 ? Colors.white : Colors.primaryColor,
                                                      fontSize: 14,
                                                      fontWeight: Constants.fontWeight
                                                  }]}>{checkItem}</Text>
                                            <View>
                                                {
                                                    this.state.idx.indexOf(idx) >= 0 ?
                                                        <Feather name="check-circle" size={20} color={Colors.white}/> :
                                                        <View // @ts-ignore
                                                            style={{
                                                                width: 20,
                                                                height: 20,
                                                                borderColor: Colors.gray,
                                                                borderWidth: Constants.borderWidth * 3.5,
                                                                borderRadius: Constants.borderRadius
                                                            }}/>
                                                }
                                            </View>
                                        </>
                                    )
                                }
                            </TouchableOpacity>
                        )
                    })
                }
            </>
        );
    }
}

const styles = (props: any, index: number) => {
    return StyleSheet.create({
        loadingSpinner: {
            // @ts-ignore
            flex: null
        },
        buttonStyle: {
            width: '95%',
            marginVertical: 10,
            height: 48,
            alignItems: 'center',
            justifyContent: 'space-around',
            borderWidth: Constants.borderWidth,
            borderRadius: Constants.borderRadius,
            // @ts-ignore
            backgroundColor: props.idx.indexOf(index) >= 0 ? Colors.secondaryColor : null,
            // @ts-ignore
            borderColor: props.idx.indexOf(index) >= 0 ? Colors.secondaryColor : Colors.gray,
            alignSelf: 'center',
            flexDirection: 'row'
        }
    });
};
