import * as Linking from 'expo-linking'
const prefix=Linking.createURL('/')
const config={
    screens:{
        Auth:{
            path:"invitationCode",
            parse:{
                invitation:(invitation:any)=>`${invitation}`
            }
        }
    }
}
const linking={
    prefixes:[prefix],
    config
}
export default linking;