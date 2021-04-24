import { HttpRequest } from "./http-request"
import { HttpResponse } from "./http-response"

export interface HttpClient<R = any> {
    request: (data: HttpRequest) => Promise<HttpResponse<R>>
}
