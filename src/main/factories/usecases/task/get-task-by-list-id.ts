import { makeApiUrl, makeAxiosHttpClient } from '@/main/factories/http'
import { FindAllTaskByListId } from '@/data/usecases/tasks/find-all-task-by-list-id'

export const makeGetTasksByListId = (): FindAllTaskByListId => {
    return new FindAllTaskByListId(makeApiUrl('/tasks'), makeAxiosHttpClient())
}
