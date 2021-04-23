import { TaskListModel } from "@/domain/models/task-list"

export interface TaskListParams {
    title: string
}

export interface CreateTaskList {
    create (params: TaskListParams): Promise<TaskListModel>
}
