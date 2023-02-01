import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeaderComponent } from './header/header.component';
import { MatExpansionModule, MatAccordion } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { UserShowComponent } from './user-show/user-show.component';
import { UserCreateComponent } from './user-create/user-create.component';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule, } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';


@NgModule({
  declarations: [
    DashboardComponent,
    HeaderComponent,
    UserShowComponent,
    UserCreateComponent
  ],
  imports: [
    CommonModule,
    MatExpansionModule,
    MatIconModule,
    RouterModule,
    MatFormFieldModule,
    MatTableModule,
    MatPaginatorModule,
    MatInputModule
  ]
})
export class AdminModule { }
