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
import { AuthGuard } from './shared/auth.guard';
import { UserCalendarComponent } from './user/user-calendar/user-calendar.component';
import { UserChatGPTComponent } from './user/user-chat-gpt/user-chat-gpt.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { UserProjectDetailsCommentsAddComponent } from './user/user-project-details-comments-add/user-project-details-comments-add.component';
import { UserProjectDetailsCommentsComponent } from './user/user-project-details-comments/user-project-details-comments.component';
import { UserProjectDetailsComponent } from './user/user-project-details/user-project-details.component';
import { UserProjectMapComponent } from './user/user-project-map/user-project-map.component';
import { UserProjectComponent } from './user/user-project/user-project.component';

const routes: Routes = [
  { path: '', component: MapsViewComponent },
  { path: 'dvf', component: DvfMapsComponent },
  { path: 'sitadel', component: SitadelMapsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/voir-utilisateurs', component: UserShowComponent },
  { path: 'dashboard/creer-utilisateur', component: UserCreateComponent },
  { path: 'user/:id/dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/calendar', component: UserCalendarComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/chatGPT', component: UserChatGPTComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/project', component: UserProjectComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/project-map', component: UserProjectMapComponent, canActivate: [AuthGuard] },
  { path: 'user/project/:id', component: UserProjectDetailsComponent, canActivate: [AuthGuard] },
  { path: 'user/project/:id/comments', component: UserProjectDetailsCommentsComponent, canActivate: [AuthGuard] },
  { path: 'user/project/:id/comments/ajouter', component: UserProjectDetailsCommentsAddComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
