import { MissingParamsError } from "@/data/errors/missing-params-error"
import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpClient, HttpStatusCode } from "@/data/protocols/http/http-client"
import { TaskModel } from "@/domain/models/task"
import { Task, TaskParams } from "@/domain/usecases/task"
import { Validation } from "@/validation/validation"

export class EditTask implements Task {
    private readonly url: string
    private readonly httpClient: HttpClient<TaskModel>
    private readonly validation: Validation
    
    constructor (url: string, httpClient: HttpClient<TaskModel>, validation: Validation) {
        this.url = url
        this.httpClient = httpClient
        this.validation = validation
    }
    
    async update (params: TaskParams): Promise<TaskModel> {
        
        const validation = this.validation.validate(params)
        
        if (validation.error) throw new MissingParamsError(validation.failedField)
        
        const httpResponse = await this.httpClient.request({
            url: this.url,
            method: 'put',
            body: params
        })
        
        switch (httpResponse.statusCode) {
            case HttpStatusCode.success: return httpResponse.body
            default: throw new UnexpectedError()
        }        
        
    }
    
}
