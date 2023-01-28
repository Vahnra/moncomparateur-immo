import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MapsService } from '../maps.service';
import { circle, latLng, polygon, tileLayer, Map, marker, icon, Icon, LayerGroup } from 'leaflet';
import { Dpe } from 'src/app/models/dpe';
import * as Leaflet from 'leaflet';


@Component({
  selector: 'app-maps-view',
  templateUrl: './maps-view.component.html',
  styleUrls: ['./maps-view.component.css']
})
export class MapsViewComponent implements OnInit {
  map!: Leaflet.Map
  enableCall: boolean = true;

  pbe: LayerGroup = new LayerGroup();

  lookup: any = [];
  
  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    ],
    zoom: 15,
    center: latLng(48.8, 2.3)
  };

  layersControl = {
    baseLayers: {
      'Open Street Map': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' }),
      'Open Cycle Map': tileLayer('https://{s}.tile.opencyclemap.org/cycle/{z}/{x}/{y}.png', { maxZoom: 18, attribution: '...' })
    },
    overlays: {
      'test': this.pbe
    }
  }
  
  layerMainGroup: LayerGroup[] = [];

  center: any;

  constructor(public httpClient: HttpClient, private mapsService: MapsService) {
 
  }


  ngOnInit() { }

  ngAfterViewInit(): void { }

  

  test: Dpe;

  onMapReady(map: Map) {
    // console.log(map.getCenter());
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position);
      map.setView([position.coords.latitude, position.coords.longitude])

      this.mapsService.refreshDpe(map.getCenter().lat, map.getCenter().lng).subscribe(data => {

        this.test = JSON.parse(JSON.stringify(data))

        this.test.results.forEach((item) => {

          let names: string = item['_geopoint'];
          let nameArr = names.split(',');

          if (this.isLocationFree(nameArr) == true) {

            this.lookup.push([nameArr[0], nameArr[1]]);

            marker([ +nameArr[0], +nameArr[1] ], {
              icon: icon({
                ...Icon.Default.prototype.options,
                iconUrl: 'assets/marker-icon.png',
                iconRetinaUrl: 'assets/marker-icon-2x.png',
                shadowUrl: 'assets/marker-shadow.png'
              })
            }).bindPopup('test').openPopup().addTo(this.pbe);
          }  
          
        }) //End of foreach

      }) // End of map service call

    })// End of get current position

    
    

  }

  
  test2($event:any) {

    if (!this.enableCall) return;
    this.enableCall = false;

    console.log($event.target.getCenter());

    this.mapsService.refreshDpe($event.target.getCenter().lat, $event.target.getCenter().lng).subscribe(data => {

      this.test = JSON.parse(JSON.stringify(data))

      this.test.results.forEach((item) => {

        let names: string = item['_geopoint'];
        let nameArr = names.split(',');

        if (this.isLocationFree(nameArr) == true) {

          this.lookup.push([nameArr[0], nameArr[1]]);

          marker([ +nameArr[0], +nameArr[1] ], {
            icon: icon({
              ...Icon.Default.prototype.options,
              iconUrl: 'assets/marker-icon.png',
              iconRetinaUrl: 'assets/marker-icon-2x.png',
              shadowUrl: 'assets/marker-shadow.png'
            })
          }).bindPopup('test').openPopup().addTo(this.pbe);
        }  
        
      }) //End of foreach

    }) // End of map service call
    
    setTimeout(() => this.enableCall = true, 1000);
  }
 
  isLocationFree(search: any) {
    for (var i = 0, l = this.lookup.length; i < l; i++) {
      if (this.lookup[i][0] === search[0] && this.lookup[i][1] === search[1]) {
        console.log(false);
        
        return false
      }
    }
    
    return true
  }
}