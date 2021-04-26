import { TaskModel } from '@/domain/models/task'
import { Component } from '@angular/core'

import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap'

@Component({
    selector: 'modal-view-tasks',
    templateUrl: './modal-view-tasks.component.html'
})

export class ModalViewTasksComponent {
    tasks: TaskModel[]
    taskListName: string

    constructor (public readonly modal: NgbActiveModal) {}

    setTasks (tasks: TaskModel[], taskListName: string): void {
        this.tasks = tasks
        this.taskListName = taskListName

    }

    getCompletedText (task: TaskModel): string {

        return task.completed ? 'Sim' : 'Não'
    }

}
