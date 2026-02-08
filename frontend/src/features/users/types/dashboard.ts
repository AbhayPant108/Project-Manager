import type { ProjectListValues } from "../../projects/project";
import type { TaskListValues } from "../../tasks/types/taskList";
export interface DashBoardValues {
    name: string,
    stats: {
        active_projects: number
        pending_tasks: number
        completed_tasks: number
    },
    projects: Array<ProjectListValues>,
    tasks: Array<TaskListValues>
}