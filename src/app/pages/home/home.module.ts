import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { HomeComponent } from './home.component'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { ModalViewTasksModule } from '@/app/components/modal-view-tasks/modal-view-tasks.module'
import { BrowserModule } from '@angular/platform-browser'
import { ModalCreateTaskListModule } from '@/app/components/modal-create-task-list/modal-create-task-list.module'
import { ModalCreateTaskModule } from '@/app/components/modal-create-task/modal-create-task.module'

@NgModule({
    imports: [
        RouterModule,
        CommonModule,
        BrowserModule,
        NgbModule,
        ModalViewTasksModule,
        ModalCreateTaskListModule,
        ModalCreateTaskModule
    ],
    declarations: [HomeComponent],
    exports: [HomeComponent]
})

export class HomeModule { }
