import { UnexpectedError } from '@/data/errors/unexpected'
import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode, HttpMethod } from '@/data/protocols/http/http-client'
import faker from 'faker'
import { DeleteTask } from './delete-task'

interface SutTypes {
    sut: DeleteTask
    httpDeleteClientStub: HttpClient<void>
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
    
    const httpDeleteClientStub = makeHttpClient()
    const sut = new DeleteTask(url, httpDeleteClientStub)
    
    return {
        sut,
        httpDeleteClientStub
    }
    
}

describe('DeleteTask use case', () => {

    test('Should call HttpClient with correct URL', async () => {

        const url = faker.internet.url()
        
        const { sut, httpDeleteClientStub } = makeSut(url)
        
        await sut.delete()
        
        expect(httpDeleteClientStub.url).toBe(url)

    })
    
    test('Should throw if HttpClient returns 400 on UnexpectedError', async () => {

        const { sut, httpDeleteClientStub } = makeSut()

        httpDeleteClientStub.response = {
            statusCode: HttpStatusCode.badRequest
        }

        const promise = sut.delete()

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 404 on UnexpectedError', async () => {

        const { sut, httpDeleteClientStub } = makeSut()

        httpDeleteClientStub.response = {
            statusCode: HttpStatusCode.notFound
        }

        const promise = sut.delete()

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 500 on UnexpectedError', async () => {

        const { sut, httpDeleteClientStub } = makeSut()

        httpDeleteClientStub.response = {
            statusCode: HttpStatusCode.serverError
        }

        const promise = sut.delete()

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should return undefined if HttpClient returns 200', async () => {

        const { sut, httpDeleteClientStub } = makeSut()
        
        httpDeleteClientStub.response = {
            statusCode: HttpStatusCode.success
        }

        const taskList = await sut.delete()

        expect(taskList).toBeUndefined()

    })         

})
