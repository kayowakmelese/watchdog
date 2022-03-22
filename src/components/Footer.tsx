import React from "react";
import {Alert, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import {FontAwesome, Ionicons, MaterialIcons} from "@expo/vector-icons";

export interface Props {
    isActive: boolean;
    activeTab: any
    currentTab: number;
}

interface State {
    navBar: any,
    activeTab: number
}

export default class Footer extends React.Component<Props, State> {
    constructor(Props: any) {
        super(Props);
        this.state = {
            activeTab: this.props.currentTab || 0,
            navBar: [
                {
                    label: 'Home',
                    iconName: 'home'
                },
                {
                    label: 'Services',
                    iconName: ''
                },
                {
                    label: 'Earning',
                    iconName: ''
                },
                {
                    label: 'Settings',
                    iconName: 'settings-outline'
                },
            ]
        }
    }

    componentWillReceiveProps(nextProps: Readonly<Props>, nextContext: any) {
        if (this.state.activeTab !== nextProps.currentTab) {
            this.setState({activeTab: nextProps.currentTab})
        }
    }

    render() {

        const {isActive} = this.props

        return (
            <View style={{
                height: 55,
                alignItems: 'center',
                position: 'absolute',
                bottom: 0,
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: Colors.primaryColor
            }}>
                {
                    this.state.navBar.map((element: any, idx: number) => {
                        return (
                            <TouchableOpacity key={idx} style={{
                                height: '100%',
                                alignSelf: 'center',
                                justifyContent: 'center',
                                borderTopWidth: idx === this.state.activeTab ? Constants.borderWidth : 0,
                                borderColor: Colors.secondaryColor
                            }}
                                // disabled={isActive && idx !== 0 }
                                              onPress={() => {
                                                  if (!isActive || idx === 0) {
                                                      this.setState({activeTab: idx})
                                                      this.props.activeTab(idx)
                                                  } else if (idx !== 0) {
                                                      Alert.alert('Warning', 'Please complete your profile detail first.')
                                                  }
                                              }}>
                                {
                                    idx === 2 ?
                                        <FontAwesome name="money" size={24}
                                                     color={idx === this.state.activeTab ? Colors.white : Colors.gray}
                                                     style={{paddingTop: 5, alignSelf: 'center'}}/> :
                                        idx === 1 ? <MaterialIcons name="home-repair-service" size={24}
                                                                   color={idx === this.state.activeTab ? Colors.white : Colors.gray}
                                                                   style={{paddingTop: 5, alignSelf: 'center'}}/> :
                                            <Ionicons name={element.iconName} size={24}
                                                      color={idx === this.state.activeTab ? Colors.white : Colors.gray}
                                                      style={{paddingTop: 5, alignSelf: 'center'}}/>
                                }

                                <Text allowFontScaling={false}
                                    // @ts-ignore
                                      style={{
                                          fontSize: 12,
                                          fontWeight: idx === this.state.activeTab ? Constants.fontWeight : 'normal',
                                          color: idx === this.state.activeTab ? Colors.white : Colors.gray,
                                          paddingTop: 5
                                      }}>{element.label}</Text>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        );
    }
}

const styles = StyleSheet.create({
    centeredView: {},
});
