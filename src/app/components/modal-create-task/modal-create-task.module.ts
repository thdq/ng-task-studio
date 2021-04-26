import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { BrowserModule } from '@angular/platform-browser'
import { ModalCreateTaskComponent } from './modal-create-task.component'
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
    exports: [ModalCreateTaskComponent],
    declarations: [ModalCreateTaskComponent]
})

export class ModalCreateTaskModule { }
