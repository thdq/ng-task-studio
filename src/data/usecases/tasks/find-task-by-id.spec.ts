import { UnexpectedError } from '@/data/errors/unexpected'
import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode, HttpMethod } from '@/data/protocols/http/http-client'
import { TaskModel } from '@/domain/models/task'
import faker from 'faker'
import { FindTaskById } from './find-task-by-id'

interface SutTypes {
    sut: FindTaskById
    httpGetClientStub: HttpClient<TaskModel>
}

const makeHttpClient = (): HttpClient<TaskModel> => {

    class HttpClientStub<R> implements HttpClient<R> {
        url?: string
        method: HttpMethod
        body?: any
        headers?: any
        response: HttpResponse<R> = {
            statusCode: HttpStatusCode.success
        }

        async request (data: HttpRequest): Promise<HttpResponse<R>> {
            this.url = data.url
            this.method = data.method
            this.body = data.body
            this.headers = data.headers
            return this.response
        }
    }

    return new HttpClientStub()

}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
    
    const httpGetClientStub = makeHttpClient()
    const sut = new FindTaskById(url, httpGetClientStub)
    
    return {
        sut,
        httpGetClientStub
    }
    
}

describe('FindTaskById use case', () => {

    test('Should call HttpClient with correct URL', async () => {

        const url = faker.internet.url()
        const id = faker.datatype.number()
        
        const { sut, httpGetClientStub } = makeSut(url)
                
        await sut.findTaskById(id)
        
        expect(httpGetClientStub.url).toBe(`${url}/${id}`)

    })
    
    test('Should throw if HttpClient returns 400 on UnexpectedError', async () => {
        
        const id = faker.datatype.number()

        const { sut, httpGetClientStub } = makeSut()

        httpGetClientStub.response = {
            statusCode: HttpStatusCode.badRequest
        }

        const promise = sut.findTaskById(id)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 404 on UnexpectedError', async () => {
        
        const id = faker.datatype.number()

        const { sut, httpGetClientStub } = makeSut()

        httpGetClientStub.response = {
            statusCode: HttpStatusCode.notFound
        }

        const promise = sut.findTaskById(id)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 500 on UnexpectedError', async () => {
        
        const id = faker.datatype.number()

        const { sut, httpGetClientStub } = makeSut()

        httpGetClientStub.response = {
            statusCode: HttpStatusCode.serverError
        }

        const promise = sut.findTaskById(id)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })    

})
