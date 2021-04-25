import { Routes } from '@angular/router'

import { HomeComponent } from '../pages/home/home.component'
import { IndexComponent } from '../pages/index/index.component'

export const LayoutRoutes: Routes = [
    {
        path: 'home',
        component: HomeComponent
    },
    {
        path: '',
        component: IndexComponent
    }

]
