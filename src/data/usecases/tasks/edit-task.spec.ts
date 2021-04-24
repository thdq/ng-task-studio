import { HttpPutParams } from '@/data/protocols/http/http-params'
import { HttpPutClient } from '@/data/protocols/http/http-put-client'
import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/http-response'
import { TaskModel } from '@/domain/models/task'
import { TaskParams } from '@/domain/usecases/task'
import faker from 'faker'
import { EditTask } from './edit-task'

interface SutTypes {
    sut: EditTask
    httpPutClientStub: HttpPutClient<TaskParams, TaskModel>
}

const makeHttpPutClient = (): HttpPutClient<TaskParams, TaskModel> => {

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

const makeSut = (url: string = faker.internet.url()): SutTypes => {
    
    const httpPutClientStub = makeHttpPutClient()
    const sut = new EditTask(url, httpPutClientStub)
    
    return {
        sut,
        httpPutClientStub
    }
    
}

describe('EditTask use case', () => {

    test('Should call HttpPutClient with correct URL', async () => {

        const url = faker.internet.url()
            
        const { sut, httpPutClientStub } = makeSut(url)
            
        const taskParams: TaskParams = {
            title: faker.random.words(),
            completed: false,
            listId: faker.datatype.number()
        }
            
        await sut.update(taskParams)
            
        expect(httpPutClientStub.url).toBe(url)
    
    })
    
    test('Should call HttpPutClient with correct body', async () => {

        const { sut, httpPutClientStub } = makeSut()

        const taskParams: TaskParams = {
            title: faker.random.words(),
            completed: false,
            listId: faker.datatype.number()
        }

        await sut.update(taskParams)

        expect(httpPutClientStub.body).toEqual(taskParams)

    })    

})
