import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpPostClient } from "@/data/protocols/http/http-post-client"
import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { TaskListModel } from "@/domain/models/task-list"
import { CreateTaskList, TaskListParams } from "@/domain/usecases/tasks-lists/create-task-list"

export class TaskList implements CreateTaskList {
    private readonly url: string
    private readonly httpPostClient: HttpPostClient<TaskListParams, TaskListModel>
    
    constructor (url: string, httpPostClient: HttpPostClient<TaskListParams, TaskListModel>) {
        this.url = url
        this.httpPostClient = httpPostClient
    }
    
    async create (params: TaskListParams): Promise<TaskListModel> {
        
        const httpResponse = await this.httpPostClient.post({
            url: this.url,
            body: params
        })
        
        switch (httpResponse.statusCode) {
            case HttpStatusCode.success: return httpResponse.body
            default: throw new UnexpectedError()
        }        
        
    }
    
}
