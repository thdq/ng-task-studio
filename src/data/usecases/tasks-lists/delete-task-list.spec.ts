import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode, HttpMethod } from '@/data/protocols/http/http-client'
import faker from 'faker'
import { DeleteTaskList } from "./delete-task-list"
import { UnexpectedError } from "@/data/errors/unexpected"

interface SutTypes {
    sut: DeleteTaskList
    httpClientStub: HttpClient<void>
}

const makeHttpClient = (): HttpClient<void> => {

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
    
    const httpClientStub = makeHttpClient()
    const sut = new DeleteTaskList(url, httpClientStub)
    
    return {
        sut,
        httpClientStub
    }
    
}

describe('DeleteTaskList use case', () => {

    test('Should call HttpClient with correct URL', async () => {

        const url = faker.internet.url()
        
        const { sut, httpClientStub } = makeSut(url)
        
        await sut.delete()
        
        expect(httpClientStub.url).toBe(url)

    })
    
    test('Should throw if HttpClient returns 400 on UnexpectedError', async () => {

        const { sut, httpClientStub } = makeSut()

        httpClientStub.response = {
            statusCode: HttpStatusCode.badRequest
        }

        const promise = sut.delete()

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 404 on UnexpectedError', async () => {

        const { sut, httpClientStub } = makeSut()

        httpClientStub.response = {
            statusCode: HttpStatusCode.notFound
        }

        const promise = sut.delete()

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 500 on UnexpectedError', async () => {

        const { sut, httpClientStub } = makeSut()

        httpClientStub.response = {
            statusCode: HttpStatusCode.serverError
        }

        const promise = sut.delete()

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should return undefined if HttpClient returns 200', async () => {

        const { sut, httpClientStub } = makeSut()
        
        httpClientStub.response = {
            statusCode: HttpStatusCode.success
        }

        const taskList = await sut.delete()

        expect(taskList).toBeUndefined()

    })     

})
