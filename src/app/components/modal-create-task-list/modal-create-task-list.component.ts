import { makeCreateTaskList } from '@/main/factories/usecases/task-list/create-task-list'
import { Component, OnInit } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'
import { TaskListParams } from '@/domain/usecases/task-list'

interface ApiResponse {
    error: boolean
    messageError: string
}

@Component({
    selector: 'modal-create-task-list',
    templateUrl: './modal-create-task-list.component.html',
    styleUrls: ['./modal-create-task-list.component.scss']
})

export class ModalCreateTaskListComponent implements OnInit {
    form: FormGroup
    waitingAPIresponse: boolean
    apiResponse: ApiResponse = {
        error: false,
        messageError: ""
    }

    constructor (public readonly modal: NgbActiveModal, private readonly formBuilder: FormBuilder) {}

    ngOnInit (): void {
        this.form = this.formBuilder.group({
            title: [null]
        })
    }

    async createTaskList (): Promise<void> {

        try {
            this.waitingAPIresponse = true
            this.resetApiResponse()

            const task: TaskListParams = this.form.value

            const createTaskListService = makeCreateTaskList()
            await createTaskListService.create(task)

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

    resetApiResponse (): void {
        this.apiResponse = {
            error: false,
            messageError: ""
        }
    }

}
