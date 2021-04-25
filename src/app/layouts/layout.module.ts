import { NgModule, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { RouterModule } from '@angular/router'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'
import { LayoutRoutes } from './layout.routing'

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(LayoutRoutes),
        FormsModule,
        NgbModule
    ]
})

export class LayoutModule implements OnInit {

    ngOnInit (): void {
        console.log()
    }

}
