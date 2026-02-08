import api from "../../../api/axios";
import {AxiosError} from "axios";
import type { Response } from "../../../types/response";
import { type Dispatch, type SetStateAction } from 'react'
import type { DashBoardValues } from "../user";
type QueryType = {
    owned?: boolean,
    updated?: boolean,
}
export const handleDashboard = async<T=DashBoardValues>(
    setValue: Dispatch<SetStateAction<T>>,
    setIsLoading:Dispatch<SetStateAction<boolean>>,
    query: QueryType |undefined = undefined,
) => {
    setIsLoading(true)
    const params = new URLSearchParams({
        owned:String(query?.owned || false),
        updated:String(query?.updated || false),
    })
    try {
        console.log("URLParams:",params.toString());
        
        const response = await api.get<Response<T>>('/dashboard/')
        const rawData = response.data.data
        console.log(rawData);
        setValue(rawData)
        }
    catch (error) {
        if (error instanceof AxiosError){
            const err = error as AxiosError<Response<undefined>>
            console.log('Error:',err.response?.data.message);
        }
    }finally{
        setIsLoading(false)
    }
}