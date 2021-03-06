import { TaskListModel } from "@/domain/models/task-list"

export interface TaskListParams {
    title: string
}

export interface TaskList {
    create? (params: TaskListParams): Promise<TaskListModel>
    
    update? (params: TaskListParams): Promise<TaskListModel>
    
    delete? (): Promise<void>
    
    findAll? (): Promise<TaskListModel[]>
}
