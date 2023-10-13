import { LoginModal, SignupReq } from "@/utils/interfaces/auth"
import getClient from "../client"

export const signup = async(values: SignupReq)=>{
    const {data} = await getClient.post('/api/auth/signup', values)
    return data
}


export const login = async(values: LoginModal)=>{
    const {data} = await getClient.post('/api/auth/login', values)
    return data
}

export const verify = async()=>{
    const {data} = await getClient.get('/api/auth/verify')
    return data
}
