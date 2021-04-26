import { makeCreateTask } from '@/main/factories/usecases/task/create-task'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { TaskParams } from '@/domain/usecases/task'
import { TaskListModel } from '@/domain/models/task-list'
import { makeFindAllTaskList } from '@/main/factories/usecases/task-list/get-all-task-list'

interface ApiResponse {
    error: boolean
    messageError: string
}

@Component({
    selector: 'modal-create-task',
    templateUrl: './modal-create-task.component.html',
    styleUrls: ['./modal-create-task.component.scss']
})

export class ModalCreateTaskComponent implements OnInit {
    form: FormGroup
    taskList: TaskListModel[] = []
    waitingAPIresponse: boolean
    apiResponse: ApiResponse = {
        error: false,
        messageError: ""
    }

    constructor (public readonly modal: NgbActiveModal, private readonly formBuilder: FormBuilder) {}

    async ngOnInit (): Promise<void> {
        this.form = this.formBuilder.group({
            title: [null],
            listId: [null]
        })

        this.taskList = await this.getTasksList()

    }

    async createTask (): Promise<void> {

        try {
            this.waitingAPIresponse = true
            this.resetApiResponse()

            const task: TaskParams = this.form.value

            const createTaskService = makeCreateTask()
            await createTaskService.create(task)

            this.modal.close()

        } catch (error) {

            this.apiResponse = {
                error: true,
                messageError: error.message
            }

        } finally {
            this.waitingAPIresponse = false
        }

    }

    async getTasksList (): Promise<TaskListModel[]> {

        const getTaskListService = makeFindAllTaskList()

        return await getTaskListService.findAll()

    }

    resetApiResponse (): void {
        this.apiResponse = {
            error: false,
            messageError: ""
        }
    }

}
