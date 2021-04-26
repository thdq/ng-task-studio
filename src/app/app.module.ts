import { BrowserModule } from "@angular/platform-browser"
import { CommonModule } from '@angular/common'
import { BrowserAnimationsModule } from "@angular/platform-browser/animations"
import { NgModule } from '@angular/core'

import { AppComponent } from './app.component'
import { AppRoutes } from './app.routing'
import { IndexComponent } from "./pages/index/index.component"
import { MyTodoComponent } from "./layouts/my-todo/my-todo.component"
import { NavbarComponent } from './components/navbar/navbar.component'
@NgModule({
    declarations: [
        AppComponent,
        IndexComponent,
        MyTodoComponent,
        NavbarComponent
    ],
    imports: [
        CommonModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutes
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
