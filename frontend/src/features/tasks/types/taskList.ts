
export interface TaskListValues{
    id:string,
    title:string,
    status:'COMPLETED'|'IN_PROGRESS'|'INCOMPLETE',
    due_date:string,
    priority:'HIGH'|'MEDIUM'|'LOW'
}