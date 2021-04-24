import { HttpResponse, HttpStatusCode } from "@/data/protocols/http/http-response"
import { HttpDeleteClient } from '@/data/protocols/http/http-delete-client'
import { HttpDeleteParams } from '@/data/protocols/http/http-params'
import faker from 'faker'
import { DeleteTaskList } from "./delete-task-list"

interface SutTypes {
    sut: DeleteTaskList
    httpDeleteClientStub: HttpDeleteClient<void>
}

const makeHttpDeleteClient = (): HttpDeleteClient<void> => {

    class HttpDeleteClientStub<R> implements HttpDeleteClient<R> {
        url?: string
        response: HttpResponse<R> = {
            statusCode: HttpStatusCode.success
        }

        async delete (params: HttpDeleteParams): Promise<HttpResponse<R>> {

            const { url } = params

            this.url = url

            return await Promise.resolve(this.response)
        }
    }

    return new HttpDeleteClientStub()

}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
    
    const httpDeleteClientStub = makeHttpDeleteClient()
    const sut = new DeleteTaskList(url, httpDeleteClientStub)
    
    return {
        sut,
        httpDeleteClientStub
    }
    
}

describe('DeleteTaskList use case', () => {

    test('Should call HttpDeleteClient with correct URL', async () => {

        const url = faker.internet.url()
        
        const { sut, httpDeleteClientStub } = makeSut(url)
        
        await sut.delete()
        
        expect(httpDeleteClientStub.url).toBe(url)

    })

})
