import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { BrowserModule } from '@angular/platform-browser'
import { ModalCreateTaskListComponent } from './modal-create-task-list.component'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

@NgModule({
    imports: [
        FormsModule,
        ReactiveFormsModule,
        RouterModule,
        BrowserModule,
        CommonModule,
        NgbModule
    ],
    exports: [ModalCreateTaskListComponent],
    declarations: [ModalCreateTaskListComponent]
})

export class ModalCreateTaskListModule { }
