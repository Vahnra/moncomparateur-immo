import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MapsService } from '../maps.service';
import { circle, latLng, polygon, tileLayer, Map, marker, icon, Icon, LayerGroup } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
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
  provider = new OpenStreetMapProvider();

  lookup: any = [];
  layerMainGroup: LayerGroup[] = [];
  center: any;

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
      'Vue satellite': tileLayer('https://wxs.ign.fr/{ignApiKey}/geoportail/wmts?'+
      '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM'+
      '&LAYER={ignLayer}&STYLE={style}&FORMAT={format}'+
      '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}', {
        ignApiKey: 'decouverte',
        ignLayer: 'ORTHOIMAGERY.ORTHOPHOTOS',
        style: 'normal',
        format: 'image/jpeg',
        service: 'WMTS'
      }),
      'Plan IGN': tileLayer('https://wxs.ign.fr/{ignApiKey}/geoportail/wmts?'+
            '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM'+
            '&LAYER={ignLayer}&STYLE={style}&FORMAT={format}'+
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
        style: 'PCI vecteur'
      }),
    },
    overlays: {
      'PBE': this.pbe
    }
  }

  constructor(public httpClient: HttpClient, private mapsService: MapsService) { }


  ngOnInit() { }

  ngAfterViewInit(): void { }

  test: Dpe;

  onMapReady(map: Map) {

    // add geosearch
    const searchControl = GeoSearchControl({
      provider: this.provider,
      style:"bar"
    });
    map.addControl(searchControl);
    

    map.addLayer(this.pbe)
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

            if (item['Date_établissement_DPE'] > '2022-09-01') {

              this.lookup.push([nameArr[0], nameArr[1]]);
              let customPopup = `
                <div class="row" style="margin-bottom: 0;>
                  <div class="col s12" style="margin-bottom: 0;">
                    <div class="card z-depth-0" style="margin-bottom: 0;">
                  
                        <span class="col s6 right-align"><strong>N°DPE</strong></span><span class="col s6">${item['N°DPE']}</span>
                        <span class="col s6 right-align"><strong>Date DPE</strong></span><span class="col s6">${item['Date_établissement_DPE']}</span>
                        <span class="col s6 right-align"><strong>Etiquette DPE</strong></span><span class="col s6">${item['Etiquette_DPE']}</span>
                        <span class="col s6 right-align"><strong>Adresse</strong></span><span class="col s6">${item['Adresse_(BAN)']}</span>
                        <!-- <span class="col s6 right-align">Complément d'adresse</span><span class="col s6">${item['Complément_d\'adresse_logement']}</span> -->
                        <span class="col s6 right-align"><strong>Type de logement</strong></span><span class="col s6">${item['Type_bâtiment']}</span>
                        <!-- <span class="col s6 right-align">Année de construction</span><span class="col s6">${item['Année_construction']}</span> -->
                        <span class="col s6 right-align"><strong>Surface habitable</strong></span><span class="col s6">${item['Surface_habitable_logement']}</span> 
                        <a class="center-align col s12" href="">Ajouter aux favoris</a>
                
                    </div>
                  </div>
                </div>`

              marker([ +nameArr[0], +nameArr[1] ], {
                icon: icon({
                  ...Icon.Default.prototype.options,
                  iconUrl: 'assets/marker-icon.png',
                  iconRetinaUrl: 'assets/marker-icon-2x.png',
                  shadowUrl: 'assets/marker-shadow.png'
                })
              }).bindPopup(customPopup, this.customOptions).openPopup().addTo(this.pbe);
            } // End check date
          } //End if not already in marker
          
        }) //End of foreach

      }) // End of map service call

    })// End of get current position

  }

  
  test2($event:any) {

    if (!this.enableCall) return;
    this.enableCall = false;

    this.mapsService.refreshDpe($event.target.getCenter().lat, $event.target.getCenter().lng).subscribe(data => {

      this.test = JSON.parse(JSON.stringify(data))

      this.test.results.forEach((item) => {

        let names: string = item['_geopoint'];
        let nameArr = names.split(',');

        if (this.isLocationFree(nameArr) == true) {

            if (item['Date_établissement_DPE'] > '2022-09-01') {

            this.lookup.push([nameArr[0], nameArr[1]]);
            let customPopup = `
              <div class="row" style="margin-bottom: 0;>
                <div class="col s12" style="margin-bottom: 0;">
                  <div class="card z-depth-0" style="margin-bottom: 0;">
                
                      <span class="col s6 right-align"><strong>N°DPE</strong></span><span class="col s6">${item['N°DPE']}</span>
                      <span class="col s6 right-align"><strong>Date DPE</strong></span><span class="col s6">${item['Date_établissement_DPE']}</span>
                      <span class="col s6 right-align"><strong>Etiquette DPE</strong></span><span class="col s6">${item['Etiquette_DPE']}</span>
                      <span class="col s6 right-align"><strong>Adresse</strong></span><span class="col s6">${item['Adresse_(BAN)']}</span>
                      <!-- <span class="col s6 right-align">Complément d'adresse</span><span class="col s6">${item['Complément_d\'adresse_logement']}</span> -->
                      <span class="col s6 right-align"><strong>Type de logement</strong></span><span class="col s6">${item['Type_bâtiment']}</span>
                      <!-- <span class="col s6 right-align">Année de construction</span><span class="col s6">${item['Année_construction']}</span> -->
                      <span class="col s6 right-align"><strong>Surface habitable</strong></span><span class="col s6">${item['Surface_habitable_logement']}</span> 
                      <a class="center-align col s12" href="">Ajouter aux favoris</a>
              
                  </div>
                </div>
              </div>`

            marker([ +nameArr[0], +nameArr[1] ], {
              icon: icon({
                ...Icon.Default.prototype.options,
                iconUrl: 'assets/marker-icon.png',
                iconRetinaUrl: 'assets/marker-icon-2x.png',
                shadowUrl: 'assets/marker-shadow.png'
              })
            }).bindPopup(customPopup, this.customOptions).openPopup().addTo(this.pbe);
          }  
        }      
      }) //End of foreach
    }) // End of map service call
    
    setTimeout(() => this.enableCall = true, 1000);
  }
 
  isLocationFree(search: any) {
    for (var i = 0, l = this.lookup.length; i < l; i++) {
      if (this.lookup[i][0] === search[0] && this.lookup[i][1] === search[1]) {    
        return false
      }
    }   
    return true
  }

  
}