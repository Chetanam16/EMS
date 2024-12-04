import { Routes } from '@angular/router';
import { AdmindashboardComponent } from './Components/admindashboard/admindashboard.component';
import { UserdashboardComponent } from './Components/userdashboard/userdashboard.component';
import { HomeComponent } from './Components/home/home.component';
import { RegisterComponent } from './Components/register/register.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'admindashboard', component: AdmindashboardComponent },
    { path: 'userdashboard', component: UserdashboardComponent },
];
