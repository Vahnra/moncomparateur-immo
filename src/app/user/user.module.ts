import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { RouterModule } from '@angular/router';
import { DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { UserCalendarComponent } from './user-calendar/user-calendar.component';



@NgModule({
  declarations: [
    UserDashboardComponent,
    UserHeaderComponent,
    UserCalendarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class UserModule { }
