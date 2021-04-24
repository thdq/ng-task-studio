import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpPutClient } from "@/data/protocols/http/http-put-client"
import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { TaskModel } from "@/domain/models/task"
import { Task, TaskParams } from "@/domain/usecases/task"
import { Validation } from "@/validation/validation"

export class EditTask implements Task {
    private readonly url: string
    private readonly httpPutClient: HttpPutClient<TaskParams, TaskModel>
    private readonly validation: Validation
    
    constructor (url: string, httpPutClient: HttpPutClient<TaskParams, TaskModel>, validation: Validation) {
        this.url = url
        this.httpPutClient = httpPutClient
        this.validation = validation
    }
    
    async update (params: TaskParams): Promise<TaskModel> {
        
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
