import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpPutClient } from "@/data/protocols/http/http-put-client"
import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { TaskListModel } from "@/domain/models/task-list"
import { TaskList, TaskListParams } from "@/domain/usecases/tasks-lists/create-task-list"
import { Validation } from "@/validation/validation"

export class EditTaskList implements TaskList {
    private readonly url: string
    private readonly httpPutClient: HttpPutClient<TaskListParams, TaskListModel>
    private readonly validation: Validation
    
    constructor (url: string, httpPutClient: HttpPutClient<TaskListParams, TaskListModel>, validation: Validation) {
        this.url = url
        this.httpPutClient = httpPutClient
        this.validation = validation
    }
    
    async update (params: TaskListParams): Promise<TaskListModel> {
        
        this.validation.validate(params)
        
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
