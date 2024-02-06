import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';  

import { AdminHubComponent } from './admin/admin-hub/admin-hub.component';
import { StationListComponent } from './admin/station-list/station-list.component';
import { StationDetailComponent } from './admin/station-detail/station-detail.component';
import { CategoryListComponent } from './admin/category-list/category-list.component';
import { ModelListComponent } from './admin/model-list/model-list.component';
import { BikesListComponent } from './admin/bikes-list/bikes-list.component'; 
import { ModelDetailComponent } from './admin/model-detail/model-detail.component';
import { BikeDetailComponent } from './admin/bike-detail/bike-detail.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

import {UserhomeComponent} from './userhome/userhome.component';
import { WalletComponent } from './wallet/wallet.component';
import { UserMapComponent } from './user-map/user-map.component';
import { authenticationGuard } from './auth.guard';
import { TicketsComponent } from './tickets/tickets.component';

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
    {
        path: 'register',
        component: RegisterComponent
    },
    

    //Admin Routes
    {
        path: "admin",
        pathMatch: 'full',
        redirectTo: "admin/stations"
    },
    {
        path: 'admin',
        component: AdminHubComponent,
        canActivateChild: [authenticationGuard],
        children: [
            {
                path: 'stations',
                component: StationListComponent,
            },
            {
                path: 'stations/:id',
                component: StationDetailComponent
            },
            {
                path: 'categories',
                component: CategoryListComponent
            },
            {
                path: 'models',
                component: ModelListComponent
            },
            {
                path: 'models/:id',
                component: ModelDetailComponent
            },
            {
                path: 'bikes',
                component: BikesListComponent
            },
            {
                path: 'bikes/:id',
                component: BikeDetailComponent
            },
        ]
    },


    // user view
    {
        path: "user",
        pathMatch: 'full',
        redirectTo: "user/home"
    },
    {
        path: 'user',
        component: UserhomeComponent,
        canActivateChild: [authenticationGuard],
        children: [
            {
                path: "home",
                component: UserMapComponent
            },
            {
                path: 'wallet',
                component: WalletComponent
            },
            {
                path: 'tickets',
                component: TicketsComponent
            },
           
        ]
        
    },


    //Not found route, needs to be at the bottom
    {
        path: '**',
        component: PageNotFoundComponent
    }

    
    
];
