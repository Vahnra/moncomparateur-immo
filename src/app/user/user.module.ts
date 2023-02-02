import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { UserHeaderComponent } from './user-header/user-header.component';
import { RouterModule } from '@angular/router';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { UserCalendarComponent } from './user-calendar/user-calendar.component';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UserChatGPTComponent } from './user-chat-gpt/user-chat-gpt.component';



@NgModule({
  declarations: [
    UserDashboardComponent,
    UserHeaderComponent,
    UserCalendarComponent,
    UserChatGPTComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModalModule,
    CalendarModule
  ]
})
export class UserModule { }
