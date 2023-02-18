import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProspectionIndexComponent } from './prospection-index/prospection-index.component';
import { ProspectionTelephoniqueComponent } from './prospection-telephonique/prospection-telephonique.component';
import { UserModule } from '../user/user.module';



@NgModule({
  declarations: [
    ProspectionIndexComponent,
    ProspectionTelephoniqueComponent,
  ],
  imports: [
    CommonModule,
  ]
})
export class ProspectionModule { }
