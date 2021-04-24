import { TaskModel } from "@/domain/models/task"

export interface TaskParams {
    listId: number
    title: string
    completed?: boolean
}

export interface Task {
    create? (params: TaskParams): Promise<TaskModel>
    
    update? (params: TaskParams): Promise<TaskModel>
    
    delete? (): Promise<void>
    
    findAllTaskByListId? (listId: number): Promise<TaskModel[]>

}
