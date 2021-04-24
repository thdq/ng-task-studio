import { HttpGetParams } from './http-params'
import { HttpResponse } from './http-response'

export interface HttpGetClient<R> {
    url?: string
    response?: HttpResponse<R>
    delete (params: HttpGetParams): Promise<HttpResponse<R>>

}
