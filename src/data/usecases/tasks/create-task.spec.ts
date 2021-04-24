import { HttpPostParams } from '@/data/protocols/http/http-params'
import { HttpPostClient } from '@/data/protocols/http/http-post-client'
import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/http-response'
import { TaskModel } from '@/domain/models/task'
import { TaskParams } from '@/domain/usecases/task'
import faker from 'faker'
import { CreateTask } from './create-task'

interface SutTypes {
    sut: CreateTask
    httpPostClientStub: HttpPostClient<TaskParams, TaskModel>
}

const makeHttpPostClient = (): HttpPostClient<TaskParams, TaskModel> => {

    class HttpPostClientStub<T, R> implements HttpPostClient<T, R> {
        url?: string
        body?: T
        response: HttpResponse<R> = {
            statusCode: HttpStatusCode.success
        }

        async post (params: HttpPostParams<T>): Promise<HttpResponse<R>> {

            const { url, body } = params

            this.url = url
            this.body = body
            return await Promise.resolve(this.response)
        }
    }

    return new HttpPostClientStub()

}

const makeSut = (url: string = faker.internet.url()): SutTypes => {
    
    const httpPostClientStub = makeHttpPostClient()
    const sut = new CreateTask(url, httpPostClientStub)
    
    return {
        sut,
        httpPostClientStub
    }
    
}

describe('CreateTask use case', () => {

    test('Should call HttpPostClient with correct URL', async () => {

        const url = faker.internet.url()
            
        const { sut, httpPostClientStub } = makeSut(url)
            
        const taskParams: TaskParams = {
            title: faker.random.words(),
            completed: false,
            listId: faker.datatype.number()
        }
            
        await sut.create(taskParams)
            
        expect(httpPostClientStub.url).toBe(url)
    
    })
    
    test('Should call HttpPostClient with correct body', async () => {

        const { sut, httpPostClientStub } = makeSut()

        const taskParams: TaskParams = {
            title: faker.random.words(),
            completed: false,
            listId: faker.datatype.number()
        }

        await sut.create(taskParams)

        expect(httpPostClientStub.body).toEqual(taskParams)

    })    

})
