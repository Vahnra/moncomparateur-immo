import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { DvfMapsComponent } from './maps/dvf-maps/dvf-maps.component';
import { MapsViewComponent } from './maps/maps-view/maps-view.component';
import { SitadelMapsComponent } from './maps/sitadel-maps/sitadel-maps.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
  { path: '', component: MapsViewComponent },
  { path: 'dvf', component: DvfMapsComponent },
  { path: 'sitadel', component: SitadelMapsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
