import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MapsService } from '../maps.service';
import { circle, latLng, polygon, tileLayer, Map, marker, icon, Icon, LayerGroup } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { Dpe } from 'src/app/models/dpe';
import * as Leaflet from 'leaflet';

@Component({
  selector: 'app-dvf-maps',
  templateUrl: './dvf-maps.component.html',
  styleUrls: ['./dvf-maps.component.css']
})
export class DvfMapsComponent implements OnInit {
  map!: Leaflet.Map
  enableCall: boolean = true;

  pbe: LayerGroup = new LayerGroup();
  provider = new OpenStreetMapProvider();
  markerClusterGroup: Leaflet.MarkerClusterGroup;
  markerClusterData: Leaflet.Marker[] = [];
  markerClusterOptions: Leaflet.MarkerClusterGroupOptions;

  lookup: any = [];
  layerMainGroup: LayerGroup[] = [];
  center: any;
  markerData: Leaflet.Marker[] = [];

  customOptions = {
    'minWidth': 300,
  }

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '...' })
    ],
    zoom: 15,
    center: latLng(48.8, 2.3)
  };

  layersControl = {
    baseLayers: {
      'Plan': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '...' }),
      'Vue satellite': tileLayer('https://wxs.ign.fr/{ignApiKey}/geoportail/wmts?' +
        '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
        '&LAYER={ignLayer}&STYLE={style}&FORMAT={format}' +
        '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}', {
        ignApiKey: 'decouverte',
        ignLayer: 'ORTHOIMAGERY.ORTHOPHOTOS',
        style: 'normal',
        format: 'image/jpeg',
        service: 'WMTS'
      }),
      'Plan IGN': tileLayer('https://wxs.ign.fr/{ignApiKey}/geoportail/wmts?' +
        '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
        '&LAYER={ignLayer}&STYLE={style}&FORMAT={format}' +
        '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}',
        {
          ignApiKey: 'decouverte',
          ignLayer: 'GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2',
          style: 'normal',
          format: 'image/png',
          service: 'WMTS',
        }),
      'Plan cadastre': tileLayer('https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
        attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
        bounds: [[-75, -180], [81, 180]],
        minZoom: 2,
        maxZoom: 19,
        apikey: 'choisirgeoportail',
        format: 'image/png',
        style: 'PCI vecteur',
      }),
    },
    overlays: {
      'PBE': this.pbe,
    }
  }


  constructor(httpClient: HttpClient, private mapsService: MapsService) {

  }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
  
  }

  onMapReady(map: Map) {

    // add geosearch
    const searchControl = GeoSearchControl({
      provider: this.provider,
      style: "bar"
    });
    map.addControl(searchControl);
    map.addLayer(this.pbe)
 
    navigator.geolocation.getCurrentPosition((position) => {
      map.setView([position.coords.latitude, position.coords.longitude])
    })// End of get current position

  }

  test2($event: any) {

    if (!this.enableCall) return;
    this.enableCall = false;



    setTimeout(() => this.enableCall = true, 1000);

  }

  markerClusterReady(group: Leaflet.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }

  //check if marker is already put at the exact same coordinate
  isLocationFree(search: any) {
    for (var i = 0, l = this.lookup.length; i < l; i++) {
      if (this.lookup[i][0] === search[0] && this.lookup[i][1] === search[1]) {
        return false
      }
    }
    return true
  }

}
