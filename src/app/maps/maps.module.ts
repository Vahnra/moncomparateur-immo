import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsViewComponent } from './maps-view/maps-view.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { DvfMapsComponent } from './dvf-maps/dvf-maps.component';
import { SitadelMapsComponent } from './sitadel-maps/sitadel-maps.component';
import { NgxMapboxGLModule } from 'ngx-mapbox-gl';



@NgModule({
  declarations: [
    MapsViewComponent,
    DvfMapsComponent,
    SitadelMapsComponent
  ],
  imports: [
    CommonModule,
    GoogleMapsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    NgxMapboxGLModule.withConfig({
      accessToken: 'pk.eyJ1IjoidmFobnJhIiwiYSI6ImNsZGVsczc0MDBlcmIzbm82ODUwbG9yeXYifQ.TgTZQqBR2BhVt8YEA6NPpw', 
    }),
  ]
})
export class MapsModule { 
  
}
