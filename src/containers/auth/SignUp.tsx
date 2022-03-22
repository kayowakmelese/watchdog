import React from "react";
import {BackHandler, ScrollView, StyleSheet, Text, View} from 'react-native'
import Colors from "../../utils/colors";
import Form from "../../components/Form";
import Button from "../../components/Button";
import ErrorModal from "../../components/errorModal";
import Strings from "../../utils/strings";
import {checkEmail} from "../../utils/CommonFunction";
export interface Props {
    navigation: any
    goBack: any;
    signupData: any;
    invitation:any;
}

interface State {
    idx: number;
    form: number;
    errors: any;
    signupInfo: any;
    error: boolean;
    disabled: boolean;
}

export default class SignUp extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            signupInfo: {},
            idx: 0,
            form: 0,
            error: false,
            errors: [],
            disabled: true
        }
    }

    handleBackButtonClick = () => {
        this.props.goBack()
        // this.props.navigation.goBack();
        return true;
    };

    async UNSAFE_componentWillMount() {
        BackHandler.addEventListener('hardwareBackPress', this.handleBackButtonClick);
        this.props.invitation.isInvitation?console.log("thisisinvitation",this.props.invitation.invitationCode):null
       

    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.handleBackButtonClick);
    }

    render() {
        const {signupData} = this.props
        return (
            <View style={{backgroundColor: Colors.primaryColor, flex: 1}}>

                <ErrorModal modalVisible={this.state.error}
                            onRequestClose={() => this.setState({error: false})}
                            style={{}}
                            errorMessage={signupData.errorMessage}
                            navigation={this.props.navigation}
                            idx={this.state.idx}/>

                <ScrollView keyboardShouldPersistTaps="always" style={{}}>
                    {
                        this.state.form === 0 ?
                            <Form data={signupData.forms}
                                  onChangeText={(label: string, value: string) => this.manageData(label, value)}
                                  initialValue={this.state.signupInfo} error={this.state.errors}/>
                            : this.state.form === 1 ?
                                (
                                    <Form data={signupData.forms_2}
                                          onChangeText={(label: string, value: string) => this.manageData(label, value)}
                                          initialValue={this.state.signupInfo} error={this.state.errors}/>
                                )
                                : (
                                    <Form data={signupData.forms_3}
                                          onChangeText={(label: string, value: string) => this.manageData(label, value)}
                                          initialValue={this.state.signupInfo} error={this.state.errors}/>
                                )
                    }
                    <Button onPress={() => {
                        let signupInfo = this.state.signupInfo
                       this.props.invitation.isInvitation?signupInfo['invitation']=this.props.invitation.invitationCode:null
                        switch (this.state.form) {
                            case 0:
                                if (!checkEmail(signupInfo.Email.toLowerCase())) {
                                    this.setState({error: true, errors: ['Email']})
                                } else if (signupInfo.PhoneNumber.length < 14) {
                                    this.setState({error: true, errors: ['PhoneNumber']})
                                }else if(signupInfo.Password.trim().length<=6){
                                    this.setState({signupInfo, error: true,idx:2,errors: ['PasswordLength']})
                                }else if (signupInfo.Password !== signupInfo.ConfirmPassword) {
                                    delete signupInfo.ConfirmPassword
                                    this.setState({signupInfo, error: true, idx: 1, errors: ['ConfirmPassword']})
                                } else {
                                    this.setState({form: 1, disabled: true, errors: [], error: false})
                                }
                                break;
                            case 1:
                                1
                                this.setState({form: 2, disabled: true})
                                break
                            case 2:
                                this.props.navigation.navigate('Policy', {
                                    policy: Strings.policy.terms,
                                    button: true,
                                    signupInfo
                                })
                                break
                        }
                    }}
                            label={signupData.buttons[0]} isLoading={false}
                            style={{width: '85%', marginVertical: '7.5%'}} noBorder={false}
                            disabled={this.state.disabled}/>
                    <Text allowFontScaling={false}
                          style={{color: Colors.textColor_2, textAlign: 'center'}}>{signupData.haveAcc}</Text>

                    <Button onPress={() => this.props.goBack()}
                            label={signupData.buttons[1]} isLoading={false}
                            style={styles(this.props).button} noBorder disabled={false}/>
                </ScrollView>
            </View>
        );
    }

    manageData(label: string, value: string) {
        let signupInfo = this.state.signupInfo
        if (value.length !== 0) {
            let errors = this.state.errors
            const index = errors.indexOf(label);
            if (index > -1) {
                errors.splice(index, 1);
                this.setState({errors})
            }
            signupInfo[label] = value
            switch (Object.keys(signupInfo).length) {
                case 6:
                    this.setState({disabled: false})
                    break;
                case 9:
                    this.setState({disabled: false})
                    break;
                case 13:
                    this.setState({disabled: false})
                    break;
            }
        } else {
            this.setState({disabled: true})
            delete signupInfo[label]
        }
        this.setState({signupInfo})
    }
}

const styles = (props: any) => {
    return StyleSheet.create({
        button: {width: '85%', marginTop: '2.5%', marginBottom: '5%'}
    });
};

