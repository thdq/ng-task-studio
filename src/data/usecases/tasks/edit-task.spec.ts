import { MissingParamsError } from '@/data/errors/missing-params-error'
import { UnexpectedError } from '@/data/errors/unexpected'
import { HttpClient, HttpRequest, HttpResponse, HttpStatusCode, HttpMethod } from '@/data/protocols/http/http-client'
import { TaskModel } from '@/domain/models/task'
import { TaskParams } from '@/domain/usecases/task'
import { Validation, ValidationError } from '@/validation/validation'
import faker from 'faker'
import { EditTask } from './edit-task'

interface SutTypes {
    sut: EditTask
    httpPutClientStub: HttpClient<TaskModel>
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

const makeHttpClient = (): HttpClient<TaskModel> => {

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
    
    const httpPutClientStub = makeHttpClient()
    const validationStub = makeValidation()
    const sut = new EditTask(url, httpPutClientStub, validationStub)
    
    return {
        sut,
        httpPutClientStub,
        validationStub
    }
    
}

describe('EditTask use case', () => {

    test('Should call HttpClient with correct URL', async () => {

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
    
    test('Should call HttpClient with correct body', async () => {

        const { sut, httpPutClientStub } = makeSut()

        const taskParams: TaskParams = {
            title: faker.random.words(),
            completed: false,
            listId: faker.datatype.number()
        }

        await sut.update(taskParams)

        expect(httpPutClientStub.body).toEqual(taskParams)

    })
    
    test('Should call Validation with correct value', async () => {
        
        const { sut, validationStub } = makeSut()
        
        const validateSpy = jest.spyOn(validationStub, 'validate')
        
        const taskParams: TaskParams = {
            title: faker.random.words(),
            completed: false,
            listId: faker.datatype.number()
        }
        
        await sut.update(taskParams)
        
        expect(validateSpy).toHaveBeenCalledWith(taskParams)
        
    })
    
    test('Should return MissingParamsError if validation fails', async () => {
        
        const { sut, validationStub } = makeSut()
        
        const taskParams: TaskParams = {
            title: faker.random.words(),
            completed: false,
            listId: faker.datatype.number()
        }
        
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce({
            error: new Error(),
            failedField: "title"
        })
        
        const promise = sut.update(taskParams)

        await expect(promise).rejects.toThrow(new MissingParamsError("title"))
        
    })
    
    test('Should throw if HttpClient returns 400 on UnexpectedError', async () => {

        const { sut, httpPutClientStub } = makeSut()

        httpPutClientStub.response = {
            statusCode: HttpStatusCode.badRequest
        }

        const taskParams: TaskParams = {
            title: faker.random.words(),
            completed: false,
            listId: faker.datatype.number()
        }

        const promise = sut.update(taskParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 404 on UnexpectedError', async () => {

        const { sut, httpPutClientStub } = makeSut()

        httpPutClientStub.response = {
            statusCode: HttpStatusCode.notFound
        }

        const taskParams: TaskParams = {
            title: faker.random.words(),
            completed: false,
            listId: faker.datatype.number()
        }

        const promise = sut.update(taskParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should throw if HttpClient returns 500 on UnexpectedError', async () => {

        const { sut, httpPutClientStub } = makeSut()

        httpPutClientStub.response = {
            statusCode: HttpStatusCode.serverError
        }

        const taskParams: TaskParams = {
            title: faker.random.words(),
            completed: false,
            listId: faker.datatype.number()
        }

        const promise = sut.update(taskParams)

        await expect(promise).rejects.toThrow(new UnexpectedError())

    })
    
    test('Should return an TaskModel if HttpClient returns 200', async () => {

        const { sut, httpPutClientStub } = makeSut()

        const httpResult: TaskModel = {
            id: faker.datatype.number(),
            listId: faker.datatype.number(),
            title: faker.random.words()
        }

        httpPutClientStub.response = {
            statusCode: HttpStatusCode.success,
            body: httpResult
        }

        const taskParams: TaskParams = {
            title: faker.random.words(),
            completed: false,
            listId: faker.datatype.number()
        }

        const taskList = await sut.update(taskParams)

        expect(taskList).toEqual(httpResult)

    })     

})
