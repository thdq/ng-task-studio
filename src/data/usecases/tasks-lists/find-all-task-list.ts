import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpGetClient } from "@/data/protocols/http/http-get-client"
import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { TaskListModel } from "@/domain/models/task-list"
import { TaskList } from "@/domain/usecases/task-list"

export class FindAllTaskList implements TaskList {
    private readonly url: string
    private readonly httpGetClient: HttpGetClient<TaskListModel[]>
    
    constructor (url: string, httpGetClient: HttpGetClient<TaskListModel[]>) {
        this.url = url
        this.httpGetClient = httpGetClient
    }
    
    async findAll (): Promise<TaskListModel[]> {
                
        const httpResponse = await this.httpGetClient.delete({
            url: this.url
        })
        
        switch (httpResponse.statusCode) {
            case HttpStatusCode.success: return httpResponse.body
            default: throw new UnexpectedError()
        }        
        
    }
    
}
