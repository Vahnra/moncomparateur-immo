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
import { UserProjectComponent } from './user-project/user-project.component';
import { UserProjectMapComponent } from './user-project-map/user-project-map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';
import { MapsModule } from '../maps/maps.module';
import { UserProjectDetailsComponent } from './user-project-details/user-project-details.component';
import { UserProjectDetailsCommentsComponent } from './user-project-details-comments/user-project-details-comments.component';
import { UserProjectDetailsCommentsAddComponent } from './user-project-details-comments-add/user-project-details-comments-add.component';
import { LoaderComponent } from './loader/loader.component';
import { UserProjectListComponent } from './user-project-list/user-project-list.component';
import { UserSettingsComponent } from './user-settings/user-settings.component';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatSortModule } from '@angular/material/sort';
import { UserProjectUpdateComponent } from './user-project-update/user-project-update.component';
import { MatButtonModule } from '@angular/material/button';



@NgModule({
  declarations: [
    UserDashboardComponent,
    UserHeaderComponent,
    UserCalendarComponent,
    UserChatGPTComponent,
    UserProjectComponent,
    UserProjectMapComponent,
    UserProjectDetailsComponent,
    UserProjectDetailsCommentsComponent,
    UserProjectDetailsCommentsAddComponent,
    LoaderComponent,
    UserProjectListComponent,
    UserSettingsComponent,
    UserProjectUpdateComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NgbModalModule,
    CalendarModule,
    LeafletModule,
    LeafletMarkerClusterModule, 
    MapsModule,
    MatExpansionModule,
    MatIconModule,
    RouterModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
  ]
})
export class UserModule { }
