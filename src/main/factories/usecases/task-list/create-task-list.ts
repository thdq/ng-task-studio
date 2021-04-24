import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http'
import { CreateTaskList } from '@/data/usecases/tasks-lists/create-task-list'
import { makeCreateTaskListValidation } from '../../validation/create-task-list'

export const makeCreateTaskList = (): CreateTaskList => {
    return new CreateTaskList(makeApiUrl('/create-task-list'), makeAxiosHttpClient(), makeCreateTaskListValidation())
}
