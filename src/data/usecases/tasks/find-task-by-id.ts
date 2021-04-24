import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpGetClient } from "@/data/protocols/http/http-get-client"
import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { TaskModel } from "@/domain/models/task"
import { Task } from "@/domain/usecases/task"

export class FindTaskById implements Task {
    private readonly url: string
    private readonly httpGetClient: HttpGetClient<TaskModel[]>
    
    constructor (url: string, httpGetClient: HttpGetClient<TaskModel[]>) {
        this.url = url
        this.httpGetClient = httpGetClient
    }
    
    async findAllTaskByListId (id: number): Promise<TaskModel[]> {
                
        const httpResponse = await this.httpGetClient.get({
            url: `${this.url}/${id}`
        })
        
        switch (httpResponse.statusCode) {
            case HttpStatusCode.success: return httpResponse.body
            default: throw new UnexpectedError()
        }        
        
    }
    
}
