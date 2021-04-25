import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { NgModule } from '@angular/core'
import { RouterModule } from '@angular/router'

import { AppComponent } from './app.component'
import { AppRoutes } from './app.routing'

import { LayoutComponent } from './layouts/layout.component'

@NgModule({
    declarations: [
        AppComponent,
        LayoutComponent
    ],
    imports: [
        BrowserAnimationsModule,
        RouterModule.forRoot(AppRoutes, {
            useHash: true
        })
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
