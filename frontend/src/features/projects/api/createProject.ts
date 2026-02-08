import api, { AxiosError } from "../../../api/axios";
import { type Response } from "../../../types/response";

export const handleCreateProject = async<T>(data:T)=>{
    try {
        const response = await api.post('/projects/',data)
        return response
    } catch (error) {
        if(error instanceof AxiosError){
            const err = error as AxiosError<Response<undefined>>
            console.log(err.response?.data.message);
            console.log(err.response?.data.errors);
            
        }
    }
}