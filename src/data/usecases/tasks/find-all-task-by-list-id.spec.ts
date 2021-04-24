import { HttpGetClient } from "@/data/protocols/http/http-get-client"
import { HttpGetParams } from "@/data/protocols/http/http-params"
import { HttpResponse, HttpStatusCode } from "@/data/protocols/http/http-response"
import { TaskModel } from "@/domain/models/task"
import faker from 'faker'
import { FindAllTaskByListId } from "./find-all-task-by-list-id"

interface SutTypes {
    sut: FindAllTaskByListId
    httpGetClientStub: HttpGetClient<TaskModel[]>
}
const makeHttpGetClient = (): HttpGetClient<TaskModel[]> => {

    class HttpGetClientStub<R> implements HttpGetClient<R> {
        url?: string
        response: HttpResponse<R> = {
            statusCode: HttpStatusCode.success
        }

        async get (params: HttpGetParams): Promise<HttpResponse<R>> {

            const { url } = params

            this.url = url

            return await Promise.resolve(this.response)
        }
    }

    return new HttpGetClientStub()

}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
    
    const httpGetClientStub = makeHttpGetClient()
    const sut = new FindAllTaskByListId(url, httpGetClientStub)
    
    return {
        sut,
        httpGetClientStub
    }
    
}

describe('FindAllTaskByListId', () => {

    test('Should call HttpGetClient with correct URL', async () => {

        const listId = 1
        const url = faker.internet.url()
        
        const { sut, httpGetClientStub } = makeSut(url)
                
        await sut.findAllTaskByListId(listId)
        
        expect(httpGetClientStub.url).toBe(`${url}?listId=${listId}`)

    })

})
