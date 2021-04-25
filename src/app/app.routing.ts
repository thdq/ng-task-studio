import { Routes } from '@angular/router'

import { LayoutComponent } from './layouts/layout.component'

export const AppRoutes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            {
                path: '',
                loadChildren: async () => await import('./layouts/layout.module').then(m => m.LayoutModule)
            }]
    }
]
