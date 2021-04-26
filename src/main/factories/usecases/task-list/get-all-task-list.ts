import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http'
import { FindAllTaskList } from '@/data/usecases/tasks-lists/find-all-task-list'

export const makeFindAllTaskList = (): FindAllTaskList => {
    return new FindAllTaskList(makeApiUrl('/lists'), makeAxiosHttpClient())
}
