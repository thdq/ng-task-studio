import { UnexpectedError } from '@/data/errors/unexpected'
import { TaskListModel } from '@/domain/models/task-list'
import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode, HttpMethod } from '@/data/protocols/http/http-client'
import faker from 'faker'
import { FindAllTaskList } from './find-all-task-list'

interface SutTypes {
    sut: FindAllTaskList
    httpClientStub: HttpClient<TaskListModel[]>
}

const makeHttpClient = (): HttpClient<TaskListModel[]> => {

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
    const sut = new FindAllTaskList(url, httpClientStub)
    
    return {
        sut,
        httpClientStub
    }
    
}

describe('FindAllTaskList use case', () => {

    test('Should call HttpClient with correct URL', async () => {

        const url = faker.internet.url()
        
        const { sut, httpClientStub } = makeSut(url)
                
        await sut.findAll()
        
        expect(httpClientStub.url).toBe(url)

    })
    
    test('Should throw if HttpClient returns 400 on UnexpectedError', async () => {

        const { sut, httpClientStub } = makeSut()

        httpClientStub.response = {
            statusCode: HttpStatusCode.badRequest
        }

        const promise = sut.findAll()

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 404 on UnexpectedError', async () => {

        const { sut, httpClientStub } = makeSut()

        httpClientStub.response = {
            statusCode: HttpStatusCode.notFound
        }

        const promise = sut.findAll()

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 500 on UnexpectedError', async () => {

        const { sut, httpClientStub } = makeSut()

        httpClientStub.response = {
            statusCode: HttpStatusCode.serverError
        }

        const promise = sut.findAll()

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should return an TaskListModel array if HttpClient returns 200', async () => {

        const { sut, httpClientStub } = makeSut()

        const httpResult: TaskListModel[] = [
            {
                id: faker.datatype.number(),
                title: faker.random.words()
            },
            {
                id: faker.datatype.number(),
                title: faker.random.words()
            }            
        ]

        httpClientStub.response = {
            statusCode: HttpStatusCode.success,
            body: httpResult
        }

        const taskList = await sut.findAll()

        expect(taskList).toEqual(httpResult)

    })     

})
