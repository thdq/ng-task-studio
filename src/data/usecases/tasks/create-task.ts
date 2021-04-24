import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpPostClient } from "@/data/protocols/http/http-post-client"
import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { TaskModel } from "@/domain/models/task"
import { Task, TaskParams } from "@/domain/usecases/task"
import { Validation } from "@/validation/validation"

export class CreateTask implements Task {
    private readonly url: string
    private readonly httpPostClient: HttpPostClient<TaskParams, TaskModel>
    private readonly validation: Validation
    
    constructor (url: string, httpPostClient: HttpPostClient<TaskParams, TaskModel>) {
        this.url = url
        this.httpPostClient = httpPostClient
    }
    
    async create (params: TaskParams): Promise<TaskModel> {
                
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
