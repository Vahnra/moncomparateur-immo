import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    UserDashboardComponent,
    UserHeaderComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class UserModule { }
