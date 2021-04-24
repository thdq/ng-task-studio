import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpClient, HttpStatusCode } from "@/data/protocols/http/http-client"
import { TaskModel } from "@/domain/models/task"
import { Task } from "@/domain/usecases/task"

export class FindAllTaskByListId implements Task {
    private readonly url: string
    private readonly httpClient: HttpClient<TaskModel[]>
    
    constructor (url: string, httpClient: HttpClient<TaskModel[]>) {
        this.url = url
        this.httpClient = httpClient
    }
    
    async findAllTaskByListId (listId: number): Promise<TaskModel[]> {
                
        const httpResponse = await this.httpClient.request({
            url: `${this.url}/${listId}`,
            method: 'get'
        })
        
        switch (httpResponse.statusCode) {
            case HttpStatusCode.success: return httpResponse.body
            default: throw new UnexpectedError()
        }        
        
    }
    
}
