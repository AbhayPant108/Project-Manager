import api from "./axios"
import { type LoginFormValues } from "../schemas/auth"
export const login = async(data:LoginFormValues)=>{
    try {
        const response = await api.post('auth/login/',{
            email : data.email,
            password : data.password
        })
        console.log(response.data);
        if (response){
            
            (response.data)
            localStorage.setItem('access_token',response.data.access)
            localStorage.setItem('refresh_token',response.data.refresh)
            // Navigate({to:'/dashboard'})
            window.location.href = '/dashboard'
        }
    } catch (error) {
        console.log('Error logging in. ',error);
    }
}
