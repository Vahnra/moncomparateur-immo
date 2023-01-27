import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MapsService } from '../maps.service';
import * as mapboxgl from 'mapbox-gl';
import { Dpe } from 'src/app/models/dpe';


@Component({
  selector: 'app-maps-view',
  templateUrl: './maps-view.component.html',
  styleUrls: ['./maps-view.component.css']
})
export class MapsViewComponent implements OnInit {

  map: mapboxgl.Map;
  mapSearch = mapboxgl.MapboxSearchBox
  test: Dpe;

  constructor(public httpClient: HttpClient, private mapsService: MapsService) {
    
  }

  ngOnInit() {
    (mapboxgl as any).accessToken = 'pk.eyJ1IjoidmFobnJhIiwiYSI6ImNsZGVsczc0MDBlcmIzbm82ODUwbG9yeXYifQ.TgTZQqBR2BhVt8YEA6NPpw';
      this.map = new mapboxgl.Map({
      container: 'map', // container ID
      style: 'mapbox://styles/vahnra/cldelssdd000601r1yvk6b5if', // style URL
      center: [2.33, 48.8], // starting position [lng, lat]
      zoom: 9, // starting zoom
    });
  }

  ngAfterViewInit(): void {

    this.mapsService.refreshDpe(this.map.getCenter()['lat'], this.map.getCenter()['lng']).subscribe(dpe => {
      this.test = JSON.parse(JSON.stringify(dpe));
      this.test.results.forEach((item) => {
        if (item['Date_établissement_DPE'] > '2022-09-01') {
          let names: string = item['_geopoint'];
          let nameArr = names.split(',');
          this.addMarker(+nameArr[1], +nameArr[0]);
        }
      }) 
    })
    
  }
 
  addMarker(lng: number, lat: number) {
    const marker = new mapboxgl.Marker({
      draggable: false
    }).setLngLat({lng,lat}).addTo(this.map)
  }
}