import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpDeleteClient } from "@/data/protocols/http/http-delete-client"
import { HttpStatusCode } from "@/data/protocols/http/http-response"
import { Task } from "@/domain/usecases/task"

export class DeleteTask implements Task {
    private readonly url: string
    private readonly httpDeleteClient: HttpDeleteClient<void>
    
    constructor (url: string, httpDeleteClient: HttpDeleteClient<void>) {
        this.url = url
        this.httpDeleteClient = httpDeleteClient
    }
    
    async delete (): Promise<void> {
                
        const httpResponse = await this.httpDeleteClient.delete({
            url: this.url
        })
        
        switch (httpResponse.statusCode) {
            case HttpStatusCode.success: break
            default: throw new UnexpectedError()
        }        
        
    }
    
}