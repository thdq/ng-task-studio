import { MissingParamsError } from '@/data/errors/missing-params-error'
import { UnexpectedError } from '@/data/errors/unexpected'
import { HttpPutParams } from '@/data/protocols/http/http-params'
import { HttpPutClient } from '@/data/protocols/http/http-put-client'
import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/http-response'
import { TaskListModel } from '@/domain/models/task-list'
import { TaskListParams } from '@/domain/usecases/tasks-lists/create-task-list'
import { Validation, ValidationError } from '@/validation/validation'
import faker from 'faker'
import { EditTaskList } from './edit-task-list'

interface SutType {
    sut: EditTaskList
    httpPutClientStub: HttpPutClient<TaskListParams, TaskListModel>
    validationStub: Validation
}

const makeValidation = (): Validation => {
    class ValidationStub implements Validation {
        validate (input: any): ValidationError {
            return {
                error: null,
                failedField: ""
            }
        }
    }
    return new ValidationStub()
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
    const validationStub = makeValidation()
    const sut = new EditTaskList(url, httpPutClientStub, validationStub)
    
    return {
        sut,
        httpPutClientStub,
        validationStub
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
    
    test('Should call Validation with correct value', async () => {
        
        const { sut, validationStub } = makeSut()
        
        const validateSpy = jest.spyOn(validationStub, 'validate')
        
        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }
        
        await sut.update(taskListParams)
        
        expect(validateSpy).toHaveBeenCalledWith(taskListParams)
        
    })
    
    test('Should return MissingParamsError if validation fails', async () => {
        
        const { sut, validationStub } = makeSut()
        
        const taskListParams: TaskListParams = {
            title: ""
        }
        
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce({
            error: new Error(),
            failedField: "title"
        })
        
        const promise = sut.update(taskListParams)

        await expect(promise).rejects.toThrow(new MissingParamsError("title"))
        
    })
    
    test('Should throw if HttpPutClient returns 400 on UnexpectedError', async () => {

        const { sut, httpPutClientStub } = makeSut()

        httpPutClientStub.response = {
            statusCode: HttpStatusCode.badRequest
        }

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        const promise = sut.update(taskListParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpPutClient returns 404 on UnexpectedError', async () => {

        const { sut, httpPutClientStub } = makeSut()

        httpPutClientStub.response = {
            statusCode: HttpStatusCode.notFound
        }

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        const promise = sut.update(taskListParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpPutClient returns 500 on UnexpectedError', async () => {

        const { sut, httpPutClientStub } = makeSut()

        httpPutClientStub.response = {
            statusCode: HttpStatusCode.serverError
        }

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        const promise = sut.update(taskListParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should return an TaskListModel if HttpPutClient returns 200', async () => {

        const { sut, httpPutClientStub } = makeSut()

        const httpResult: TaskListModel = {
            id: faker.datatype.number(),
            title: faker.random.words()
        }

        httpPutClientStub.response = {
            statusCode: HttpStatusCode.success,
            body: httpResult
        }

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        const user = await sut.update(taskListParams)

        expect(user).toEqual(httpResult)

    })     

})
