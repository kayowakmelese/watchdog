import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';

// screens
import Intro from "../screens/Intro"
import Auth from "../screens/Auth";
import Main from "../screens/Main";
import Login from "../containers/auth/Login";
import SignUp from "../containers/auth/SignUp";
import Home from "../containers/main/Home";
import Services from "../containers/main/Services/Services";
import Earnings from "../containers/main/Earnings/Earnings";
import Settings from "../containers/main/Settings";
import Policy from "../screens/Policy";
import Verification from "../containers/auth/Verification";
import Profile from "../containers/auth/Profile";
import Reset from "../containers/Reset";
import CustomCamera from "../screens/Other/CustomCamera";
import MyProfile from "../containers/main/MyProfile";
import EarningDetail from "../containers/main/Earnings/EarningDetail";
import ServiceDetail from "../containers/main/Services/ServiceDetail";
import Invite from "../containers/main/Invite";
import Available from "../containers/main/Home/Available";
import Documents from "../containers/main/Pending/Documents";
import Skill from "../containers/main/Pending/Skill";
import linking from './linking'
const Stack = createStackNavigator();

export interface Props {
}

interface State {
    routeName: string
}

export default class Routes extends React.Component<Props, State> {

    constructor(Props: any) {
        super(Props);
        this.state = {
            routeName: "Intro"
        }
    }

    render() {
        return (
            <NavigationContainer linking={linking}>
                <Stack.Navigator initialRouteName={this.state.routeName}
                                 screenOptions={{headerShown: false, gestureEnabled: false}}>
                    <Stack.Screen name="Intro" component={Intro}/>

                    <Stack.Screen name="Auth" component={Auth}/>
                    <Stack.Screen name="Login" component={Login}/>
                    <Stack.Screen name="Reset" component={Reset}/>
                    <Stack.Screen name="SignUp" component={SignUp}/>
                    <Stack.Screen name="Verification" component={Verification}/>

                    <Stack.Screen name="Profile" component={Profile}/>
                    <Stack.Screen name="CustomCamera" component={CustomCamera}/>

                    <Stack.Screen name="Main" component={Main}/>

                    <Stack.Screen name="Home" component={Home}/>

                    <Stack.Screen name="Documents" component={Documents}/>
                    <Stack.Screen name="Skill" component={Skill}/>

                    <Stack.Screen name="Available" component={Available}/>

                    <Stack.Screen name="Services" component={Services}/>
                    <Stack.Screen name="ServiceDetail" component={ServiceDetail}/>

                    <Stack.Screen name="Earnings" component={Earnings}/>
                    <Stack.Screen name="EarningDetail" component={EarningDetail}/>

                    <Stack.Screen name="Settings" component={Settings}/>
                    <Stack.Screen name="Invite" component={Invite}/>
                    <Stack.Screen name="MyProfile" component={MyProfile}/>

                    <Stack.Screen name="Policy" component={Policy}/>

                </Stack.Navigator>
            </NavigationContainer>
        );
    }
}
