// import axios from "axios";
import axiosRetry from 'axios-retry';

const axios = require('axios').default;

axiosRetry(axios, {retries: 3});

const baseUrl = "https://rc5bh19lwl.execute-api.us-east-2.amazonaws.com/beta"
// const baseUrl = "http://192.168.1.2:5000/beta"
// const baseUrl = "http://192.168.170.188:5000/beta"

const headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    "Access-Control-Allow-Origin": "*",
}

const Transport = {
    Auth: {
        sendOTP: (data: any) => axios.post(`${baseUrl}/auth/sendOTP`, data),
        resetPassword: (data: any) => axios.patch(`${baseUrl}/auth/resetPassword`, data),
        verifyOTP: (data: any) => axios.post(`${baseUrl}/auth/verify`, data),
        signup: (data: any) => axios.post(`${baseUrl}/auth/signup`, data),
        login: (data: any) => axios.post(`${baseUrl}/auth/login`, data)
    },
    Earnings: {
        getEarnings: (token: string) => axios.get(`${baseUrl}/earning/self`, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
    },
    User: {
        profileDetails: (token: string) => axios.get(`${baseUrl}/user/profile`, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
        updateProfile: (token: string, data: any) => axios.patch(`${baseUrl}/user/updateProfile`, data, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
        uploadDocuments: (token: string, data: any) => axios.patch(`${baseUrl}/user/uploadDocuments`, data, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
    },
    Request: {
        changeStatus: (token: string, requestId: string, data: any) => axios.patch(`${baseUrl}/request/changeStatus/${requestId}`, data, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
        getUserRequests: (token: string) => axios.get(`${baseUrl}/request/requests`, {
            headers: {
                ...headers,
                "Authorization": 'Bearer ' + token
            }
        }),
    }
}

export default Transport;
