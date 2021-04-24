import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode, HttpMethod } from '@/data/protocols/http/http-client'
import { TaskModel } from "@/domain/models/task"
import faker from 'faker'
import { FindAllTaskByListId } from "./find-all-task-by-list-id"

interface SutTypes {
    sut: FindAllTaskByListId
    httpGetClientStub: HttpClient<TaskModel[]>
}

const makeHttpClient = (): HttpClient<TaskModel[]> => {

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
    const sut = new FindAllTaskByListId(url, httpGetClientStub)
    
    return {
        sut,
        httpGetClientStub
    }
    
}

describe('FindAllTaskByListId', () => {

    test('Should call HttpClient with correct URL', async () => {

        const listId = 1
        const url = faker.internet.url()
        
        const { sut, httpGetClientStub } = makeSut(url)
                
        await sut.findAllTaskByListId(listId)
        
        expect(httpGetClientStub.url).toBe(`${url}/${listId}`)

    })
    
    test('Should throw if HttpClient returns 400 on UnexpectedError', async () => {
        
        const listId = 1

        const { sut, httpGetClientStub } = makeSut()

        httpGetClientStub.response = {
            statusCode: HttpStatusCode.badRequest
        }

        const promise = sut.findAllTaskByListId(listId)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 404 on UnexpectedError', async () => {
        
        const listId = 1

        const { sut, httpGetClientStub } = makeSut()

        httpGetClientStub.response = {
            statusCode: HttpStatusCode.notFound
        }

        const promise = sut.findAllTaskByListId(listId)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 500 on UnexpectedError', async () => {
        
        const listId = 1

        const { sut, httpGetClientStub } = makeSut()

        httpGetClientStub.response = {
            statusCode: HttpStatusCode.serverError
        }

        const promise = sut.findAllTaskByListId(listId)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should return an TaskModel array if HttpClient returns 200', async () => {
        
        const listId = 1

        const { sut, httpGetClientStub } = makeSut()

        const httpResult: TaskModel[] = [
            {
                id: faker.datatype.number(),
                listId: faker.datatype.number(),
                title: faker.random.words()
            },
            {
                id: faker.datatype.number(),
                listId: faker.datatype.number(),
                title: faker.random.words()
            }            
        ]

        httpGetClientStub.response = {
            statusCode: HttpStatusCode.success,
            body: httpResult
        }

        const taskList = await sut.findAllTaskByListId(listId)

        expect(taskList).toEqual(httpResult)

    })     

})
