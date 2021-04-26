import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { ModalViewTasksComponent } from '@/app/components/modal-view-tasks/modal-view-tasks.component'
import { BrowserModule } from '@angular/platform-browser'

@NgModule({
    imports: [
        RouterModule,
        BrowserModule,
        CommonModule,
        NgbModule
    ],
    declarations: [ModalViewTasksComponent],
    exports: [ModalViewTasksComponent]
})

export class ModalViewTasksModule { }
