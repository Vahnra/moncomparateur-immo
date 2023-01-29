import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsViewComponent } from './maps-view/maps-view.component';
import { GoogleMapsModule } from '@angular/google-maps';
import { HttpClientModule, HttpClientJsonpModule } from '@angular/common/http';
import { DvfMapsComponent } from './dvf-maps/dvf-maps.component';
import { SitadelMapsComponent } from './sitadel-maps/sitadel-maps.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { LeafletMarkerClusterModule } from '@asymmetrik/ngx-leaflet-markercluster';



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
    LeafletModule,
    LeafletMarkerClusterModule
  ]
})
export class MapsModule { }
