import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http'
import { CreateTask } from '@/data/usecases/tasks/create-task'
import { makeCreateTaskValidation } from '../../validation/create-task'

export const makeCreateTask = (): CreateTask => {
    return new CreateTask(makeApiUrl('/tasks'), makeAxiosHttpClient(), makeCreateTaskValidation())
}
