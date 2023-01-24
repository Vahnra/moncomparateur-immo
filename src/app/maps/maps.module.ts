import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsViewComponent } from './maps-view/maps-view.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';



@NgModule({
  declarations: [
    MapsViewComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
  ]
})
export class MapsModule { }
