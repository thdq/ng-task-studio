import { HttpGetClient } from '@/data/protocols/http/http-get-client'
import { HttpDeleteParams } from '@/data/protocols/http/http-params'
import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/http-response'
import { TaskListModel } from '@/domain/models/task-list'
import faker from 'faker'
import { FindAllTaskList } from './find-all-task-list'

interface SutTypes {
    sut: FindAllTaskList
    httpGetClientStub: HttpGetClient<TaskListModel[]>
}
const makeHttpGetClient = (): HttpGetClient<TaskListModel[]> => {

    class HttpGetClientStub<R> implements HttpGetClient<R> {
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

    return new HttpGetClientStub()

}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
    
    const httpGetClientStub = makeHttpGetClient()
    const sut = new FindAllTaskList(url, httpGetClientStub)
    
    return {
        sut,
        httpGetClientStub
    }
    
}

describe('FindAllTaskList use case', () => {

    test('Should call HttpPostClient with correct URL', async () => {

        const url = faker.internet.url()
        
        const { sut, httpGetClientStub } = makeSut(url)
                
        await sut.findAll()
        
        expect(httpGetClientStub.url).toBe(url)

    })

})
