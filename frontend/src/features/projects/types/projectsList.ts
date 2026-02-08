import type { ProjectMemberInfo } from "./projectDetail";

export interface ProjectListValues {
    id:string,
    title:string,
    description:string,
    members_count:number,
    tasks_count:number,
    tasks_completed:number,
    access:'PRIVATE'|'PUBLIC'|'FRIENDS_ONLY',
    status:'INCOMPLETE'|'IN_PROGRESS'|'COMPLETED',
    created_at:string,
    updated_at:string,
    owner:ProjectMemberInfo
}



