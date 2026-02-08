import api from "../../../api/axios";
import {AxiosError} from "axios";
import type { Response } from "../../../types/response";
import { type Dispatch, type SetStateAction } from 'react'
import type { ProjectDetailsValues, ProjectTasksInfo } from "../../projects/project";

export const handleProjectDetails = async<T>(
    setValue: Dispatch<SetStateAction<T>>,
    setIsLoading:Dispatch<SetStateAction<boolean>>,
    project_id:string = 'cb22f2f3-32dd-402a-8741-07789ef4c6c3'  //must Change
) => {
    setIsLoading(true)
    try {        
        const response = await api.get<Response<T>>(`/projects/${project_id}`)
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
export const handleProjectTasks = async<T>(
    setValue: Dispatch<SetStateAction<T>>,
    setIsLoading:Dispatch<SetStateAction<boolean>>,
    project_id:string = 'cb22f2f3-32dd-402a-8741-07789ef4c6c3'
) => {
    setIsLoading(true)
    try {        
        const response = await api.get<Response<T>>(`/projects/${project_id}/tasks`)
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


