export type HttpMethod = 'post' | 'get' | 'put' | 'delete'

export interface HttpRequest {
    url: string
    method: HttpMethod
    body?: any
    headers?: any
}
