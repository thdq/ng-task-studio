import { NgModule } from "@angular/core"
import { Routes, RouterModule } from "@angular/router"
import { MyTodoComponent } from "./layouts/my-todo/my-todo.component"
import { HomeComponent } from "./pages/home/home.component"
import { IndexComponent } from "./pages/index/index.component"
import { HomeModule } from "./pages/home/home.module"
import { CommonModule } from "@angular/common"
import { BrowserModule } from "@angular/platform-browser"

const routes: Routes = [
    {
        path: "my-todo",
        component: MyTodoComponent,
        children: [
            { path: "", redirectTo: "home", pathMatch: "full" },
            { path: "home", component: HomeComponent }
        ]
    },
    { path: "", component: IndexComponent },
    { path: "**", redirectTo: "", pathMatch: "full" }
]

@NgModule({
    imports: [
        HomeModule,
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: [RouterModule]
})
export class AppRoutes {}
