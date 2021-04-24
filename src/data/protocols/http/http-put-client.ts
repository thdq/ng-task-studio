import { HttpPutParams } from './http-params'
import { HttpResponse } from './http-response'

export interface HttpPutClient<T, R> {
    url?: string
    body?: T
    response?: HttpResponse<R>
    put (params: HttpPutParams<T>): Promise<HttpResponse<R>>

}
