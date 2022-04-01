import * as Linking from 'expo-linking'
const prefix=Linking.createURL('/')
const config={
    screens:{
        Auth:{
            path:"invitationCode",
            parse:{
                invitation:(invitation:any)=>`${invitation}`
            }
        },
        Main:{
            path:"Services",
        }
    }
}
const linking={
    prefixes:[prefix],
    config
}
export default linking;