import { UnexpectedError } from '@/data/errors/unexpected'
import { HttpPostParams } from '@/data/protocols/http/http-params'
import { HttpPostClient } from '@/data/protocols/http/http-post-client'
import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/http-response'
import { TaskListModel } from '@/domain/models/task-list'
import { TaskListParams } from '@/domain/usecases/tasks-lists/create-task-list'
import faker from 'faker'
import { TaskList } from './task-list'

interface SutType {
    sut: TaskList
    httpPostClientStub: HttpPostClient<TaskListParams, TaskListModel>
}

const makeHttpPostClient = (): HttpPostClient<TaskListParams, TaskListModel> => {

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

const makeSut = (url: string = faker.internet.url()): SutType => {
    
    const httpPostClientStub = makeHttpPostClient()
    const sut = new TaskList(url, httpPostClientStub)
    
    return {
        sut,
        httpPostClientStub
    }
    
}

describe('TaskList use case', () => {

    test('Should call HttpPostClient with correct URL', async () => {

        const url = faker.internet.url()
        
        const { sut, httpPostClientStub } = makeSut(url)
        
        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }
        
        await sut.create(taskListParams)
        
        expect(httpPostClientStub.url).toBe(url)

    })
    
    test('Should call HttpPostClient with correct body', async () => {

        const { sut, httpPostClientStub } = makeSut()

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        await sut.create(taskListParams)

        expect(httpPostClientStub.body).toEqual(taskListParams)

    })
    
    test('Should throw if HttpPostClient returns 400 on UnexpectedError', async () => {

        const { sut, httpPostClientStub } = makeSut()

        httpPostClientStub.response = {
            statusCode: HttpStatusCode.badRequest
        }

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        const promise = sut.create(taskListParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })    

})
