import { HttpPutParams } from '@/data/protocols/http/http-params'
import { HttpPutClient } from '@/data/protocols/http/http-put-client'
import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/http-response'
import { TaskListModel } from '@/domain/models/task-list'
import { TaskListParams } from '@/domain/usecases/tasks-lists/create-task-list'
import faker from 'faker'
import { EditTaskList } from './edit-task-list'

interface SutType {
    sut: EditTaskList
    httpPutClientStub: HttpPutClient<TaskListParams, TaskListModel>
}

const makeHttpPutClient = (): HttpPutClient<TaskListParams, TaskListModel> => {

    class HttpPutClientStub<T, R> implements HttpPutClient<T, R> {
        url?: string
        body?: T
        response: HttpResponse<R> = {
            statusCode: HttpStatusCode.success
        }

        async put (params: HttpPutParams<T>): Promise<HttpResponse<R>> {

            const { url, body } = params

            this.url = url
            this.body = body
            return await Promise.resolve(this.response)
        }
    }

    return new HttpPutClientStub()

}

const makeSut = (url: string = faker.internet.url()): SutType => {
    
    const httpPutClientStub = makeHttpPutClient()
    const sut = new EditTaskList(url, httpPutClientStub)
    
    return {
        sut,
        httpPutClientStub
    }
    
}

describe('EditTaskList use case', () => {

    test('Should call HttpPutClient with correct URL', async () => {

        const url = faker.internet.url()
        
        const { sut, httpPutClientStub } = makeSut(url)
        
        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }
        
        await sut.update(taskListParams)
        
        expect(httpPutClientStub.url).toBe(url)

    })
    
    test('Should call HttpPutClient with correct body', async () => {

        const { sut, httpPutClientStub } = makeSut()

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        await sut.update(taskListParams)

        expect(httpPutClientStub.body).toEqual(taskListParams)

    })    

})
