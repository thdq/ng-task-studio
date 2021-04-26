import { ModalViewTasksComponent } from '@/app/components/modal-view-tasks/modal-view-tasks.component'
import { ModalCreateTaskListComponent } from '@/app/components/modal-create-task-list/modal-create-task-list.component'
import { TaskModel } from '@/domain/models/task'
import { TaskListModel } from '@/domain/models/task-list'
import { TaskListParams } from '@/domain/usecases/task-list'
import { makeCreateTaskList } from '@/main/factories/usecases/task-list/create-task-list'
import { makeFindAllTaskList } from '@/main/factories/usecases/task-list/get-all-task-list'
import { makeGetTasksByListId } from '@/main/factories/usecases/task/get-task-by-list-id'
import { Component, OnInit } from '@angular/core'
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'
import { ModalCreateTaskComponent } from '@/app/components/modal-create-task/modal-create-task.component'

@Component({
    templateUrl: './home.component.html'
})

export class HomeComponent implements OnInit {
    taskList: TaskListModel[] = []
    task: TaskModel[] = []
    waitingAPI: boolean

    constructor (private readonly modalService: NgbModal) {}

    async ngOnInit (): Promise<void> {
        this.taskList = await this.getTasksList()
    }

    async createTaskList (params: TaskListParams): Promise<any> {

        const createTaskListService = makeCreateTaskList()

        await createTaskListService.create(params)

    }

    async getTasksList (): Promise<TaskListModel[]> {

        try {
            this.waitingAPI = true

            const getTaskListService = makeFindAllTaskList()

            return await getTaskListService.findAll()

        } catch (error) {

            console.error(error)

        } finally {
            this.waitingAPI = false
        }

    }

    async openTaskModal (task: TaskModel): Promise<void> {

        const getTasksByListIdService = makeGetTasksByListId()

        const taskResult = await getTasksByListIdService.findAllTaskByListId(task.id)

        const modalRef = this.modalService.open(ModalViewTasksComponent, {
            size: 'lg'
        })

        modalRef.componentInstance.setTasks([taskResult], task.title)
    }

    openCreateTaskListModal (): void {

        this.modalService.open(ModalCreateTaskListComponent, {
            size: 'md',
            windowClass: "custom-dialog",
            centered: true
        })
    }

    openCreateTaskModal (): void {

        this.modalService.open(ModalCreateTaskComponent, {
            size: 'md',
            windowClass: "custom-dialog",
            centered: true
        })

    }

}
