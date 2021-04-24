import { MissingParamsError } from '@/data/errors/missing-params-error'
import { UnexpectedError } from '@/data/errors/unexpected'
import { HttpPutParams } from '@/data/protocols/http/http-params'
import { HttpPutClient } from '@/data/protocols/http/http-put-client'
import { HttpResponse, HttpStatusCode } from '@/data/protocols/http/http-response'
import { TaskModel } from '@/domain/models/task'
import { TaskParams } from '@/domain/usecases/task'
import { Validation, ValidationError } from '@/validation/validation'
import faker from 'faker'
import { EditTask } from './edit-task'

interface SutTypes {
    sut: EditTask
    httpPutClientStub: HttpPutClient<TaskParams, TaskModel>
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
    const validationStub = makeValidation()
    const sut = new EditTask(url, httpPutClientStub, validationStub)
    
    return {
        sut,
        httpPutClientStub,
        validationStub
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
    
    test('Should throw if HttpPutClient returns 400 on UnexpectedError', async () => {

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
    
    test('Should throw if HttpPutClient returns 404 on UnexpectedError', async () => {

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
    
    test('Should throw if HttpPutClient returns 500 on UnexpectedError', async () => {

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

})
