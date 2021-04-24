export interface HttpPostParams<T> {
    url: string
    body?: T
}

export interface HttpPutParams<T> {
    url: string
    body?: T
}

export interface HttpDeleteParams {
    url: string
}

export interface HttpGetParams {
    url: string
}
