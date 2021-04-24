import { HttpDeleteParams } from './http-params'
import { HttpResponse } from './http-response'

export interface HttpDeleteClient<R> {
    url?: string
    response?: HttpResponse<R>
    delete (params: HttpDeleteParams): Promise<HttpResponse<R>>

}
