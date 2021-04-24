import { MissingParamsError } from "@/data/errors/missing-params-error"
import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpPostClient } from "@/data/protocols/http/http-post-client"
import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { TaskListModel } from "@/domain/models/task-list"
import { CreateTaskList, TaskListParams } from "@/domain/usecases/tasks-lists/create-task-list"
import { Validation } from "@/validation/validation"

export class TaskList implements CreateTaskList {
    private readonly url: string
    private readonly httpPostClient: HttpPostClient<TaskListParams, TaskListModel>
    private readonly validation: Validation
    
    constructor (url: string, httpPostClient: HttpPostClient<TaskListParams, TaskListModel>, validation: Validation) {
        this.url = url
        this.httpPostClient = httpPostClient
        this.validation = validation
    }
    
    async create (params: TaskListParams): Promise<TaskListModel> {
        
        const validation = this.validation.validate(params)
        
        if (validation.error) throw new MissingParamsError(validation.failedField)
        
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
