import { MissingParamsError } from '@/data/errors/missing-params-error'
import { UnexpectedError } from '@/data/errors/unexpected'
import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode, HttpMethod } from '@/data/protocols/http/http-client'
import { TaskListModel } from '@/domain/models/task-list'
import { TaskListParams } from '@/domain/usecases/task-list'
import { Validation, ValidationError } from '@/validation/validation'
import faker from 'faker'
import { CreateTaskList } from './create-task-list'

interface SutType {
    sut: CreateTaskList
    httpClientStub: HttpClient<TaskListModel>
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

const makeHttpClient = (): HttpClient<TaskListModel> => {

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

const makeSut = (url: string = faker.internet.url()): SutType => {
    
    const httpClientStub = makeHttpClient()
    const validationStub = makeValidation()
    const sut = new CreateTaskList(url, httpClientStub, validationStub)
    
    return {
        sut,
        httpClientStub,
        validationStub
    }
    
}

describe('CreateTaskList use case', () => {

    test('Should call HttpClient with correct URL', async () => {

        const url = faker.internet.url()
        
        const { sut, httpClientStub } = makeSut(url)
        
        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }
        
        await sut.create(taskListParams)
        
        expect(httpClientStub.url).toBe(url)

    })
    
    test('Should call HttpClient with correct body', async () => {

        const { sut, httpClientStub } = makeSut()

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        await sut.create(taskListParams)

        expect(httpClientStub.body).toEqual(taskListParams)

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
    
    test('Should throw if HttpClient returns 400 on UnexpectedError', async () => {

        const { sut, httpClientStub } = makeSut()

        httpClientStub.response = {
            statusCode: HttpStatusCode.badRequest
        }

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        const promise = sut.create(taskListParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 404 on UnexpectedError', async () => {

        const { sut, httpClientStub } = makeSut()

        httpClientStub.response = {
            statusCode: HttpStatusCode.notFound
        }

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        const promise = sut.create(taskListParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 500 on UnexpectedError', async () => {

        const { sut, httpClientStub } = makeSut()

        httpClientStub.response = {
            statusCode: HttpStatusCode.serverError
        }

        const taskListParams: TaskListParams = {
            title: faker.random.words()
        }

        const promise = sut.create(taskListParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should return an TaskListModel if HttpClient returns 200', async () => {

        const { sut, httpClientStub } = makeSut()

        const httpResult: TaskListModel = {
            id: faker.datatype.number(),
            title: faker.random.words()
        }

        httpClientStub.response = {
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
