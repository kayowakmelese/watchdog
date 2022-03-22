import React from "react";
import {StyleSheet, Text, View} from "react-native";
import Colors from "../utils/colors";
import {Constants} from "../utils/constants";
import {FontAwesome} from "@expo/vector-icons";
import CustomModal from "./CustomModal";
import Button from "./Button";

export interface Props {
    cardViewContent: any;
    height: any;
    width: any;
    style: any;
    navigation: any;
    modalVisible: boolean;
    onRequestClose: any;
    successMessage: any;
}

interface State {
}

export default class SuccessfulCard extends React.Component<Props, State> {

    render() {
        return (
            <>
                <CustomModal navigation={this.props.navigation} modalVisible={this.props.modalVisible}
                             onRequestClose={() => this.setState({modalVisible: false})}
                             renderView={() => {
                                 return (
                                     <>
                                         <View style={{
                                             alignSelf: 'center',
                                             borderRadius: Constants.radius * 10,
                                             zIndex: 1,
                                             position: 'relative',
                                             bottom: -53,
                                             justifyContent: 'center',
                                             width: 106,
                                             height: 106,
                                             backgroundColor: 'white'
                                         }}>
                                             <View style={{
                                                 alignSelf: 'center',
                                                 borderRadius: Constants.radius * 10,
                                                 zIndex: 1,
                                                 position: 'relative',
                                                 justifyContent: 'center',
                                                 width: 100,
                                                 height: 100,
                                                 backgroundColor: 'black'
                                             }}>
                                                 <View style={{
                                                     alignSelf: 'center',
                                                     borderRadius: Constants.radius * 10,
                                                     zIndex: 1,
                                                     position: 'relative',
                                                     justifyContent: 'center',
                                                     alignItems: 'center',
                                                     width: 57,
                                                     height: 57,
                                                     backgroundColor: 'white'
                                                 }}>
                                                     <FontAwesome name="check" size={24} color="black"/>
                                                 </View>
                                             </View>
                                         </View>
                                         <View
                                             style={[styles(this.props).userInfo, styles(this.props).card, this.props.style]}>
                                             {
                                                 this.props.cardViewContent === undefined ?
                                                     <View style={{width: '100%'}}>
                                                         <Text allowFontScaling={false}
                                                             // @ts-ignore
                                                               style={{
                                                                   textAlign: 'center',
                                                                   fontWeight: Constants.fontWeight,
                                                                   fontSize: 18
                                                               }}>
                                                             {this.props.successMessage.title}
                                                         </Text>
                                                         <Text
                                                             allowFontScaling={false}
                                                             style={{
                                                                 textAlign: 'center',
                                                                 marginBottom: 15,
                                                                 fontSize: 14
                                                             }}
                                                         >{this.props.successMessage.messages}</Text>
                                                         <Button onPress={() => this.props.onRequestClose()}
                                                                 label={this.props.successMessage.button}
                                                                 isLoading={false}
                                                                 style={{}}
                                                                 noBorder={false}
                                                                 disabled={false}/>
                                                     </View>
                                                     : this.props.cardViewContent()
                                             }
                                         </View>
                                     </>
                                 )
                             }} center={true} style={{}}/>

            </>
        );
    }
}

const styles = (props: any) => StyleSheet.create({
    userInfo: {
        flexDirection: 'row',
        alignSelf: 'center',
        marginBottom: 15,
        backgroundColor: 'white',
    },
    card: {
        height: props.height ? props.height : null,
        width: props.width ? props.width : '100%',
        borderColor: Colors.white,
        borderWidth: Constants.borderWidth,
        borderRadius: Constants.radius,
        padding: 10,
        paddingTop: 40,
        shadowColor: Colors.shadowColor,
        shadowOpacity: Constants.opacity,
        shadowRadius: Constants.shadowRadius,
        elevation: Constants.elevation,
    }
});
