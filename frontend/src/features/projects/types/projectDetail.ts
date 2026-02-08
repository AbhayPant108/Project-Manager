import type { ProjectFormValues } from "../project"
import type { TaskListValues } from "../../tasks/types/taskList"

export interface ProjectTasksInfo {
    tasks_count: number,
    tasks_list: Array<TaskListValues>
    tasks_completed: number
}
export interface ProjectMemberInfo {
    id: string,
    username: string,
    full_name: string | null,
    avatar: string
}
export interface ProjectDetailsValues extends ProjectFormValues {
    id: string,
    members: Array<ProjectMemberInfo>,
    owner: ProjectMemberInfo,
    created_at: string
}