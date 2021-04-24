import { MissingParamsError } from '@/data/errors/missing-params-error'
import { UnexpectedError } from '@/data/errors/unexpected'
import { HttpPostParams } from '@/data/protocols/http/http-params'
import { HttpPostClient } from '@/data/protocols/http/http-post-client'
import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/http-response'
import { TaskListModel } from '@/domain/models/task-list'
import { TaskListParams } from '@/domain/usecases/task-list'
import { Validation, ValidationError } from '@/validation/validation'
import faker from 'faker'
import { CreateTaskList } from './create-task-list'

interface SutType {
    sut: CreateTaskList
    httpPostClientStub: HttpPostClient<TaskListParams, TaskListModel>
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
    const validationStub = makeValidation()
    const sut = new CreateTaskList(url, httpPostClientStub, validationStub)
    
    return {
        sut,
        httpPostClientStub,
        validationStub
    }
    
}

describe('CreateTaskList use case', () => {

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
    
    test('Should call Validation with correct value', async () => {
        
        const { sut, validationStub } = makeSut()
        
        const validateSpy = jest.spyOn(validationStub, 'validate')
        
        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }
        
        await sut.create(taskListParams)
        
        expect(validateSpy).toHaveBeenCalledWith(taskListParams)
        
    })
    
    test('Should return MissingParamsError if validation returns fails', async () => {
        
        const { sut, validationStub } = makeSut()
        
        const taskListParams: TaskListParams = {
            title: ""
        }
        
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce({
            error: new Error(),
            failedField: "title"
        })
        
        const promise = sut.create(taskListParams)

        await expect(promise).rejects.toThrow(new MissingParamsError("title"))
        
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
    
    test('Should throw if HttpPostClient returns 404 on UnexpectedError', async () => {

        const { sut, httpPostClientStub } = makeSut()

        httpPostClientStub.response = {
            statusCode: HttpStatusCode.notFound
        }

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        const promise = sut.create(taskListParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpPostClient returns 500 on UnexpectedError', async () => {

        const { sut, httpPostClientStub } = makeSut()

        httpPostClientStub.response = {
            statusCode: HttpStatusCode.serverError
        }

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        const promise = sut.create(taskListParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should return an TaskListModel if HttpPostClient returns 200', async () => {

        const { sut, httpPostClientStub } = makeSut()

        const httpResult: TaskListModel = {
            id: faker.datatype.number(),
            title: faker.random.words()
        }

        httpPostClientStub.response = {
            statusCode: HttpStatusCode.success,
            body: httpResult
        }

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        const taskList = await sut.create(taskListParams)

        expect(taskList).toEqual(httpResult)

    })       

})
