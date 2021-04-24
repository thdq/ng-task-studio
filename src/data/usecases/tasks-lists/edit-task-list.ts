import { MissingParamsError } from "@/data/errors/missing-params-error"
import { UnexpectedError } from "@/data/errors/unexpected"
import { TaskListModel } from "@/domain/models/task-list"
import { HttpClient, HttpStatusCode } from "@/data/protocols/http/http-client"
import { TaskList, TaskListParams } from "@/domain/usecases/task-list"
import { Validation } from "@/validation/validation"

export class EditTaskList implements TaskList {
    private readonly url: string
    private readonly httpClient: HttpClient<TaskListModel>
    private readonly validation: Validation
    
    constructor (url: string, httpClient: HttpClient<TaskListModel>, validation: Validation) {
        this.url = url
        this.httpClient = httpClient
        this.validation = validation
    }
    
    async update (params: TaskListParams): Promise<TaskListModel> {
        
        const validation = this.validation.validate(params)
        
        if (validation.error) throw new MissingParamsError(validation.failedField)
        
        const httpResponse = await this.httpClient.request({
            url: this.url,
            body: params,
            method: "put"
        })
        
        switch (httpResponse.statusCode) {
            case HttpStatusCode.success: return httpResponse.body
            default: throw new UnexpectedError()
        }        
        
    }
    
}
