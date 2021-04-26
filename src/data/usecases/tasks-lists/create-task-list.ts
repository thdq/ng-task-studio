import { MissingParamsError } from "@/data/errors/missing-params-error"
import { UnexpectedError } from "@/data/errors/unexpected"
import { HttpClient, HttpStatusCode } from "@/data/protocols/http/http-client"
import { TaskListModel } from "@/domain/models/task-list"
import { TaskList, TaskListParams } from "@/domain/usecases/task-list"
import { Validation } from "@/validation/validation"

export class CreateTaskList implements TaskList {
    private readonly url: string
    private readonly httpClient: HttpClient<TaskListModel>
    private readonly validation: Validation

    constructor (url: string, httpClient: HttpClient<TaskListModel>, validation: Validation) {
        this.url = url
        this.httpClient = httpClient
        this.validation = validation
    }

    async create (params: TaskListParams): Promise<TaskListModel> {

        const validation = this.validation.validate(params)

        if (validation?.error) throw new MissingParamsError(validation.failedField)

        const httpResponse = await this.httpClient.request({
            url: this.url,
            method: 'post',
            body: params
        })

        const taskListResult = httpResponse.body

        switch (httpResponse.statusCode) {

            case HttpStatusCode.success: case HttpStatusCode.created: return taskListResult

            default: throw new UnexpectedError()
        }

    }

}
