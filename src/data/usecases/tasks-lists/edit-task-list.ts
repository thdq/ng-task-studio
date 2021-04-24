import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpPutClient } from "@/data/protocols/http/http-put-client"
import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { TaskListModel } from "@/domain/models/task-list"
import { TaskList, TaskListParams } from "@/domain/usecases/tasks-lists/create-task-list"

export class EditTaskList implements TaskList {
    private readonly url: string
    private readonly httpPutClient: HttpPutClient<TaskListParams, TaskListModel>
    
    constructor (url: string, httpPutClient: HttpPutClient<TaskListParams, TaskListModel>) {
        this.url = url
        this.httpPutClient = httpPutClient
    }
    
    async update (params: TaskListParams): Promise<TaskListModel> {
        
        const httpResponse = await this.httpPutClient.put({
            url: this.url,
            body: params
        })
        
        switch (httpResponse.statusCode) {
            case HttpStatusCode.success: return httpResponse.body
            default: throw new UnexpectedError()
        }        
        
    }
    
}
