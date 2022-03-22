import React from "react";
import {BackHandler, SafeAreaView, ScrollView, Share, StyleSheet, Text, View} from 'react-native'
import Colors from "../../utils/colors";
import {FontAwesome} from "@expo/vector-icons";
import {Constants} from "../../utils/constants";
import Strings from "../../utils/strings";
import Button from "../../components/Button";

export interface Props {
    navigation: any
}

interface State {
}

export default class Invite extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {}
    }

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

        const Settings = Strings.settings

        return (
            <ScrollView contentContainerStyle={{
                flex: 1,
                justifyContent: 'space-between'
            }} style={{backgroundColor: Colors.primaryColor,}}>
                <SafeAreaView style={{backgroundColor: Colors.primaryColor, flex: 1}}>
                    <View
                        style={{marginVertical: 55, flexDirection: 'row', paddingHorizontal: 32, alignItems: 'center'}}>
                        <FontAwesome name="chevron-left" size={24} color={Colors.white} style={{marginRight: 25}}
                                     onPress={() => this.props.navigation.pop()}/>
                        <Text allowFontScaling={false}
                            // @ts-ignore
                              style={{color: Colors.white, fontSize: 24, fontWeight: Constants.fontWeight}}>
                            {Settings.headers[2]}</Text>
                    </View>
                    <View style={{
                        alignItems: 'center', padding: 20, borderRadius: Constants.borderRadius,
                        marginHorizontal: 20, borderColor: Colors.gray, borderWidth: Constants.borderWidth / 4
                    }}>
                        <Text allowFontScaling={false}
                              style={{fontSize: 16, color: Colors.white}}>{Settings.invite.codeLabel} <Text
                            allowFontScaling={false}
                            // @ts-ignore
                            style={{color: Colors.white, fontWeight: Constants.fontWeight}}
                        >{Settings.invite.code}</Text> </Text>
                    </View>

                    <View style={{
                        marginTop: '15%', backgroundColor: '#191919', padding: 25, borderRadius: Constants.borderRadius,
                        marginHorizontal: 20, borderColor: Colors.gray, borderWidth: Constants.borderWidth / 4
                    }}>
                        <Text allowFontScaling={false}
                              style={{fontSize: 16, color: Colors.white}}>{Settings.invite.title}</Text>
                        <Text allowFontScaling={false} style={{
                            paddingVertical: 20,
                            textAlign: 'justify',
                            fontSize: 14,
                            color: Colors.gray
                        }}>{Settings.invite.subTitle}</Text>
                    </View>
                    <View style={{position: 'absolute', bottom: 10, width: '100%'}}>
                        {
                            Settings.invite.buttons.map((button: string, idx: number) => {
                                return (
                                    <Button key={idx} onPress={async () => {
                                        try {
                                            const result = await Share.share({
                                                message: `\n${Settings.invite.codeLabel} : ${Settings.invite.code} \n Watch Dogg app \n https://expo.io/@mekuriyaworku/projects/Watch_Dogg`,
                                            });
                                            if (result.action === Share.sharedAction) {
                                                if (result.activityType) {
                                                    // shared with activity type of result.activityType
                                                } else {
                                                    // shared
                                                }
                                            } else if (result.action === Share.dismissedAction) {
                                                // dismissed
                                            }
                                        } catch (error) {
                                            alert(error.message);
                                        }
                                    }}
                                            label={button}
                                            isLoading={false}
                                            style={{width: '75%'}}
                                            noBorder={false}
                                            disabled={false}/>
                                )
                            })
                        }
                    </View>
                </SafeAreaView>
            </ScrollView>
        );
    }
}

const styles = (props: any) => {
    return StyleSheet.create({});
};

