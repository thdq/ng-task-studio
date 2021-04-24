import { UnexpectedError } from "@/data/errors/unexpected"
import { TaskListModel } from "@/domain/models/task-list"
import { HttpClient, HttpStatusCode } from "@/data/protocols/http/http-client"
import { TaskList } from "@/domain/usecases/task-list"

export class FindAllTaskList implements TaskList {
    private readonly url: string
    private readonly httpGetClient: HttpClient<TaskListModel[]>
    
    constructor (url: string, httpGetClient: HttpClient<TaskListModel[]>) {
        this.url = url
        this.httpGetClient = httpGetClient
    }
    
    async findAll (): Promise<TaskListModel[]> {
                
        const httpResponse = await this.httpGetClient.request({
            method: "get",
            url: this.url
        })
        
        switch (httpResponse.statusCode) {
            case HttpStatusCode.success: return httpResponse.body
            default: throw new UnexpectedError()
        }        
        
    }
    
}
