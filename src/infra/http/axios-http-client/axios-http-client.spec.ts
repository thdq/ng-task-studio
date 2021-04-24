import { HttpRequest } from '@/data/protocols/http/http-request'
import axios from 'axios'
import faker from 'faker'
import { AxiosHttpClient } from './axios-http-client'

jest.mock('axios')

interface SutTypes {
    sut: AxiosHttpClient
    mockedAxios: jest.Mocked<typeof axios>
}

const makeAxios = (): jest.Mocked<typeof axios> => {
    
    const mockHttpResponse = (): any => ({
        data: faker.random.objectElement(),
        status: faker.datatype.number()
    })
    
    const mockedAxios = axios as jest.Mocked<typeof axios>
    
    mockedAxios.request.mockClear().mockResolvedValue(mockHttpResponse())
    
    return mockedAxios
}

const makeSut = (): SutTypes => {
    const sut = new AxiosHttpClient()
    const mockedAxios = makeAxios()
    return {
        sut,
        mockedAxios
    }
}

describe('AxiosHttpClient', () => {
    
    test('Should call axios with correct values', async () => {
        
        const request: HttpRequest = {
            url: faker.internet.url(),
            method: faker.random.arrayElement(['get', 'post', 'put', 'delete']),
            body: faker.random.objectElement(),
            headers: faker.random.objectElement()
        }
          
        const { sut, mockedAxios } = makeSut()

        await sut.request(request)

        expect(mockedAxios.request).toHaveBeenCalledWith({
            url: request.url,
            data: request.body,
            headers: request.headers,
            method: request.method
        })
        
    })
    
    test('Should return correct response', async () => {
        
        const { sut, mockedAxios } = makeSut()
        
        const request: HttpRequest = {
            url: faker.internet.url(),
            method: faker.random.arrayElement(['get', 'post', 'put', 'delete']),
            body: faker.random.objectElement(),
            headers: faker.random.objectElement()
        }        
    
        const httpResponse = await sut.request(request)
        const axiosResponse = await mockedAxios.request.mock.results[0].value
    
        expect(httpResponse).toEqual({
            statusCode: axiosResponse.status,
            body: axiosResponse.data
        })
        
    })    

})
