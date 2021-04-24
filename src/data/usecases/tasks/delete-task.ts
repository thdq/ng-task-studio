import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpClient, HttpStatusCode } from "@/data/protocols/http/http-client"
import { Task } from "@/domain/usecases/task"

export class DeleteTask implements Task {
    private readonly url: string
    private readonly httpClient: HttpClient<void>
    
    constructor (url: string, httpClient: HttpClient<void>) {
        this.url = url
        this.httpClient = httpClient
    }
    
    async delete (): Promise<void> {
                
        const httpResponse = await this.httpClient.request({
            url: this.url,
            method: 'delete'
        })
        
        switch (httpResponse.statusCode) {
            case HttpStatusCode.success: break
            default: throw new UnexpectedError()
        }        
        
    }
    
}
