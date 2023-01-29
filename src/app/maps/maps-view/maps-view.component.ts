import { Component, ElementRef, HostListener, NgZone, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MapsService } from '../maps.service';
import { circle, latLng, polygon, tileLayer, Map, marker, icon, Icon, LayerGroup } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { Dpe } from 'src/app/models/dpe';
import * as Leaflet from 'leaflet';
import { FavoritesService } from 'src/app/_services/favorites.service';



@Component({
  selector: 'app-maps-view',
  templateUrl: './maps-view.component.html',
  styleUrls: ['./maps-view.component.css']
})
export class MapsViewComponent implements OnInit {
  @HostListener('document:click', ['$event']) click(event:any) { 
    if(event.target.classList.contains("favorite-button")){ this.onAjouterFavorisClick(); }
  }

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
  currentMarker: Leaflet.Marker;

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
      'Plan': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        maxZoom: 19, 
        attribution: '...' 
      }),
      'Vue satellite': tileLayer('https://wxs.ign.fr/{ignApiKey}/geoportail/wmts?' +
        '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
        '&LAYER={ignLayer}&STYLE={style}&FORMAT={format}' +
        '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}', {
        maxZoom: 19,
        ignApiKey: 'decouverte',
        ignLayer: 'ORTHOIMAGERY.ORTHOPHOTOS',
        style: 'normal',
        format: 'image/jpeg',
        service: 'WMTS'
      }),
      'Plan IGN': tileLayer('https://wxs.ign.fr/{ignApiKey}/geoportail/wmts?' +
        '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
        '&LAYER={ignLayer}&STYLE={style}&FORMAT={format}' +
        '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}', {
          maxZoom: 19,
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

  constructor(
    public httpClient: HttpClient, 
    private mapsService: MapsService, 
    private favoritesService: FavoritesService, 
    private zone: NgZone
    ) { }


  ngOnInit() {

  }

  ngAfterViewInit(): void { }

  test: Dpe;

  onMapReady(map: Map) {

    // add geosearch
    const searchControl = GeoSearchControl({
      provider: this.provider,
      style: "bar"
    });
    map.addControl(searchControl);


    map.addLayer(this.pbe);
    // console.log(map.getCenter());
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position);
      map.setView([position.coords.latitude, position.coords.longitude])

      this.mapsService.refreshDpe(map.getCenter().lat, map.getCenter().lng).subscribe(data => {

        this.test = JSON.parse(JSON.stringify(data))

        this.test.results.forEach((item) => {

          this.addMarker(item);

        }) //End of foreach

      }) // End of map service call

    })// End of get current position

    const alicanteMarker = marker([38.34517, -0.48149]).on('click', event => {
      console.log('Yay, my marker was clicked!', event);
  });
  }

  test2($event: any) {

    if (!this.enableCall) return;
    this.enableCall = false;

    this.mapsService.refreshDpe($event.target.getCenter().lat, $event.target.getCenter().lng).subscribe(data => {

      this.test = JSON.parse(JSON.stringify(data))

      this.test.results.forEach((item) => {

        this.addMarker(item);

      }) //End of foreach
      this.markerClusterGroup.clearLayers()
      this.markerClusterData = this.markerData;
      this.markerClusterGroup.addLayers(this.markerClusterData)
      
    }) // End of map service call

    // var popup = this.map.layer.getPopup();
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

  markerClusterReady(group: Leaflet.MarkerClusterGroup) {

    this.markerClusterGroup = group;

  }

  addMarker(item: any) {
    let names: string = item['_geopoint'];
    let nameArr = names.split(',');

    if (this.isLocationFree(nameArr) == true) {

      if (item['Date_établissement_DPE'] > '2022-09-01') {

        this.lookup.push([nameArr[0], nameArr[1]]);
        let customPopup = `
              <div class="row" style="margin-bottom: 0;>
                <div class="col s12" style="margin-bottom: 0;">
                  <div class="card z-depth-0" style="margin-bottom: 0;">
                
                      <span class="col s6 right-align"><strong>N°DPE</strong></span><span class="col s6" id="dpe-number">${item['N°DPE']}</span>
                      <span class="col s6 right-align"><strong>Date DPE</strong></span><span class="col s6" id="dpe-date">${item['Date_établissement_DPE']}</span>
                      <span class="col s6 right-align"><strong>Etiquette DPE</strong></span><span class="col s6" id="dpe-class">${item['Etiquette_DPE']}</span>
                      <span class="col s6 right-align"><strong>Adresse</strong></span><span class="col s6" id="adress">${item['Adresse_(BAN)']}</span>
                      <!-- <span class="col s6 right-align">Complément d'adresse</span><span class="col s6">${item['Complément_d\'adresse_logement']}</span> -->
                      <span class="col s6 right-align"><strong>Type de logement</strong></span><span class="col s6" id="building-type">${item['Type_bâtiment']}</span>
                      <!-- <span class="col s6 right-align">Année de construction</span><span class="col s6">${item['Année_construction']}</span> -->
                      <span class="col s6 right-align"><strong>Surface habitable</strong></span><span class="col s6" id="area-size">${item['Surface_habitable_logement']}</span> 
                      <a class="center-align col s12 favorite-button" href="#" >Ajouter aux favoris</a>
              
                  </div>
                </div>
              </div>`

        this.markerData.push(Leaflet.marker([+nameArr[0], +nameArr[1]], {
          icon: icon({
            ...Icon.Default.prototype.options,
            iconUrl: 'assets/marker-icon.png',
            iconRetinaUrl: 'assets/marker-icon-2x.png',
            shadowUrl: 'assets/marker-shadow.png'
          })
        }).on('click', () => {
          this.zone.run(() => this.onMarkerClick(item))
        }).bindPopup(customPopup, this.customOptions).openPopup());
      
      }
    }
  }

  onMarkerClick(item: any) {
    this.currentMarker = item;
    // console.log(item);  
  }

  onAjouterFavorisClick() {
    var dpeNumber = document.getElementById("dpe-number")?.innerHTML;
    var dpeDate = document.getElementById("dpe-date")?.innerHTML;
    var dpeClass = document.getElementById("dpe-class")?.innerHTML;
    var adress = document.getElementById("adress")?.innerHTML;
    var buildingType = document.getElementById("building-type")?.innerHTML;
    var areaSize = document.getElementById("area-size")?.innerHTML;

    let markerData = JSON.parse(JSON.stringify(this.currentMarker));
    console.log(markerData);

    let names: string = markerData['_geopoint'];
    let nameArr = names.split(',');
    
    this.favoritesService.addFavorite(markerData['N°DPE'], markerData['Date_établissement_DPE'], markerData['Etiquette_DPE'], markerData['Adresse_(BAN)'], markerData['Type_bâtiment'], markerData['Surface_habitable_logement'], nameArr[0], nameArr[1]).subscribe({
      next: data => {
        console.log(data); 
      },
      error: error => console.log(error)
    })
    
  }
  
}