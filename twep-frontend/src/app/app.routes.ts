import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';

import { AdminHubComponent } from './admin/admin-hub/admin-hub.component';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { StationListComponent } from './admin/station-list/station-list.component';
import { StationDetailComponent } from './admin/station-detail/station-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: LoginComponent
    },

    //Admin Routes
    {
        path: 'admin',
        component: AdminHubComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
            },
            {
                path: 'stations',
                component: StationListComponent,
            },
            {
                path: 'stations/:id',
                component: StationDetailComponent
            }
        ]
    },


    //Not found route
    {
        path: '**',
        component: PageNotFoundComponent
    }
    
    
];
