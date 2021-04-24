import { UnexpectedError } from "@/data/errors/unexpected"
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
    
    test('Should throw if HttpGetClient returns 400 on UnexpectedError', async () => {
        
        const listId = 1

        const { sut, httpGetClientStub } = makeSut()

        httpGetClientStub.response = {
            statusCode: HttpStatusCode.badRequest
        }

        const promise = sut.findAllTaskByListId(listId)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpGetClient returns 404 on UnexpectedError', async () => {
        
        const listId = 1

        const { sut, httpGetClientStub } = makeSut()

        httpGetClientStub.response = {
            statusCode: HttpStatusCode.notFound
        }

        const promise = sut.findAllTaskByListId(listId)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpGetClient returns 500 on UnexpectedError', async () => {
        
        const listId = 1

        const { sut, httpGetClientStub } = makeSut()

        httpGetClientStub.response = {
            statusCode: HttpStatusCode.serverError
        }

        const promise = sut.findAllTaskByListId(listId)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should return an TaskModel array if HttpGetClient returns 200', async () => {
        
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
