import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserCreateComponent } from './admin/user-create/user-create.component';
import { UserShowComponent } from './admin/user-show/user-show.component';
import { LoginComponent } from './login/login.component';
import { DvfMapsComponent } from './maps/dvf-maps/dvf-maps.component';
import { MapsViewComponent } from './maps/maps-view/maps-view.component';
import { SitadelMapsComponent } from './maps/sitadel-maps/sitadel-maps.component';
import { RegisterComponent } from './register/register.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';

const routes: Routes = [
  { path: '', component: MapsViewComponent },
  { path: 'dvf', component: DvfMapsComponent },
  { path: 'sitadel', component: SitadelMapsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/voir-utilisateurs', component: UserShowComponent },
  { path: 'dashboard/creer-utilisateur', component: UserCreateComponent },
  { path: 'user/:id/dashboard', component: UserDashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
