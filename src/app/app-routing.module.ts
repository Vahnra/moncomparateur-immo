import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { UserCreateComponent } from './admin/user-create/user-create.component';
import { UserShowComponent } from './admin/user-show/user-show.component';
import { LoginComponent } from './login/login.component';
import { DvfMapsComponent } from './maps/dvf-maps/dvf-maps.component';
import { MapsViewComponent } from './maps/maps-view/maps-view.component';
import { SitadelMapsComponent } from './maps/sitadel-maps/sitadel-maps.component';
import { ProspectionIndexComponent } from './prospection/prospection-index/prospection-index.component';
import { ProspectionTelephoniqueComponent } from './prospection/prospection-telephonique/prospection-telephonique.component';
import { RegisterComponent } from './register/register.component';
import { AuthGuard } from './shared/auth.guard';
import { UserCalendarComponent } from './user/user-calendar/user-calendar.component';
import { UserChatGPTComponent } from './user/user-chat-gpt/user-chat-gpt.component';
import { UserContactsAddComponent } from './user/user-contacts-add/user-contacts-add.component';
import { UserContactsComponent } from './user/user-contacts/user-contacts.component';
import { UserDashboardComponent } from './user/user-dashboard/user-dashboard.component';
import { UserPasswordUpdateComponent } from './user/user-password-update/user-password-update.component';
import { UserPaymentComponent } from './user/user-payment/user-payment.component';
import { UserProfilUpdateComponent } from './user/user-profil-update/user-profil-update.component';
import { UserProjectDetailsCommentsAddComponent } from './user/user-project-details-comments-add/user-project-details-comments-add.component';
import { UserProjectDetailsCommentsComponent } from './user/user-project-details-comments/user-project-details-comments.component';
import { UserProjectDetailsComponent } from './user/user-project-details/user-project-details.component';
import { UserProjectListComponent } from './user/user-project-list/user-project-list.component';
import { UserProjectMapComponent } from './user/user-project-map/user-project-map.component';
import { UserProjectUpdateComponent } from './user/user-project-update/user-project-update.component';
import { UserProjectComponent } from './user/user-project/user-project.component';
import { UserReceiptDetailsComponent } from './user/user-receipt-details/user-receipt-details.component';
import { UserReceiptComponent } from './user/user-receipt/user-receipt.component';
import { UserSettingsComponent } from './user/user-settings/user-settings.component';

const routes: Routes = [
  { path: '', component: UserProjectMapComponent },
  { path: 'dvf', component: DvfMapsComponent },
  { path: 'sitadel', component: SitadelMapsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'dashboard/voir-utilisateurs', component: UserShowComponent },
  { path: 'dashboard/creer-utilisateur', component: UserCreateComponent },
  { path: 'user/:id/dashboard', component: UserDashboardComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/scenario', component: ProspectionIndexComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/telephonique', component: ProspectionTelephoniqueComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/payment', component: UserPaymentComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/contacts', component: UserContactsComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/factures', component: UserReceiptComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/factures/:receiptId', component: UserReceiptDetailsComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/profile-update', component: UserProfilUpdateComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/password-update', component: UserPasswordUpdateComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/contacts/ajouter', component: UserContactsAddComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/paramètres', component: UserSettingsComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/calendar', component: UserCalendarComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/chatGPT', component: UserChatGPTComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/project', component: UserProjectComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/project-update/:projectId', component: UserProjectUpdateComponent, canActivate: [AuthGuard] },
  { path: 'user/:id/project-list', component: UserProjectListComponent, canActivate: [AuthGuard] },
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
