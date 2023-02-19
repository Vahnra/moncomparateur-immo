import { Component, ElementRef, HostListener, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { MapsService } from '../maps.service';
import { circle, latLng, polygon, tileLayer, Map, marker, icon, Icon, LayerGroup } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { Dpe } from 'src/app/models/dpe';
import * as Leaflet from 'leaflet';
import { FavoritesService } from 'src/app/_services/favorites.service';
import { ProjectService } from 'src/app/_services/project.service';
import { ToastService } from 'src/app/_services/toast.service';
import { ReplaySubject, takeUntil } from 'rxjs';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';



@Component({
  selector: 'app-maps-view',
  templateUrl: './maps-view.component.html',
  styleUrls: ['./maps-view.component.css']
})
export class MapsViewComponent implements OnInit, OnDestroy {
  @HostListener('document:click', ['$event']) click(event:any) { 
    if(event.target.classList.contains("favorite-button")){ this.onAjouterFavorisClick(); }
  }

  destroy: ReplaySubject<any> = new ReplaySubject<any>(1);
  
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

  userLat1: any;
  userLng1: any;
  userLat2: any;
  userLng2: any;

  userRole: any;
  user: any;
  userId: number;
  isLoggedIn: boolean = false;
  userPostCode: any;

  options = {
    layers: [
      tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '...' })
    ],
    zoom: 15,
    center: latLng(48.8, 2.3),
    zoomControl: false,
  };

  leafletLayersControlOptions = {
    position: 'bottomright'
  };
  
  layersControl = {
    baseLayers: {
      'Plan par défaut': tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
        maxZoom: 19, 
        attribution: '...' 
      }),
      'Vue satellite': tileLayer('https://wxs.ign.fr/decouverte/geoportail/wmts?' +
        '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
        '&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&STYLE=normal&FORMAT=image/jpeg' +
        '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}', {
        maxZoom: 19,
      }),
      'Plan IGN': tileLayer('https://wxs.ign.fr/decouverte/geoportail/wmts?' +
        '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
        '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png' +
        '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}', {
          maxZoom: 19,
        }),
      'Plan cadastre': tileLayer('https://wxs.ign.fr/choisirgeoportail/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=PCI vecteur&TILEMATRIXSET=PM&FORMAT=image/png&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
        attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
        bounds: [[-75, -180], [81, 180]],
        minZoom: 2,
        maxZoom: 19,
      }),
    },
    overlays: {
 
    },
  }

  constructor(
    public httpClient: HttpClient, 
    private mapsService: MapsService, 
    private favoritesService: FavoritesService, 
    private projectService: ProjectService,
    public toastService: ToastService,
    private storageService: StorageService,
    private userService: UserService,
    private zone: NgZone
    ) {

    if (this.storageService.isLoggedIn) {
      this.userService.getCurrentUser().subscribe(user => {

        this.user = user;
        this.userId = user.id;
        this.isLoggedIn = true;
        this.userRole = user.status;

        if (user.status === "paid") {

          if (this.userRole == "paid") {
            this.mapsService.requestGeocodingDepartment(`${user.postal_code}, France`).subscribe({
              next: data => {
                let info = JSON.parse(JSON.stringify(data))
                this.userLat1 = info["data"][0]["bbox_module"][0];
                this.userLng1 = info["data"][0]["bbox_module"][1];
                this.userLat2 = info["data"][0]["bbox_module"][2];
                this.userLng2 = info["data"][0]["bbox_module"][3];
                this.mapsService.refreshDpe(this.userLat1, this.userLng1, this.userLat2, this.userLng2,).pipe(takeUntil(this.destroy)).subscribe(data => {

                  this.test = JSON.parse(JSON.stringify(data))

                  this.test.results.forEach((item) => {

                    this.addMarker(item);
                  }) //End of foreach

                }) // End of map service call
              }
            })
          }
        } 
      });
    }
  }


  ngOnInit() {
    
  }

  ngAfterViewInit(): void { }

  ngOnDestroy(): void {
    this.destroy.next(null);
  }

  test: Dpe;

  onMapReady(map: Map) {

    // add geosearch
    const searchControl = GeoSearchControl({
      provider: this.provider,
      style: "bar",
      searchLabel: 'Entrée une adresse'
    });
    map.addControl(searchControl);

    // map.addLayer(this.pbe);
    // console.log(map.getCenter());
    
    
    navigator.geolocation.getCurrentPosition((position) => {
      // console.log(position);
      map.setView([position.coords.latitude, position.coords.longitude]);

    })// End of get current position

   
  }

  test2($event: any) {

    if (!this.enableCall) return;
    this.enableCall = false;

    // this.mapsService.refreshDpe($event.target.getCenter().lat, $event.target.getCenter().lng).pipe(takeUntil(this.destroy)).subscribe(data => {
      
    //   this.test = JSON.parse(JSON.stringify(data))
      
    //   this.test.results.forEach((item) => {

    //     this.addMarker(item);

    //   }) //End of foreach
    //   // this.markerClusterGroup.clearLayers()
 
      
    // }) // End of map service call

    this.markerClusterData = this.markerData;
    this.markerClusterGroup.addLayers(this.markerClusterData)
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
                <div class="col-12" style="margin-bottom: 0;">
                  <div class="card border-0" style="margin-bottom: 0;">
                    <div class="row" >
                      <span class="col-6 text-end"><strong>N°DPE</strong></span><span class="col-6" id="dpe-number">${item['N°DPE']}</span>
                      <span class="col-6 text-end"><strong>Date DPE</strong></span><span class="col-6" id="dpe-date">${item['Date_établissement_DPE']}</span>
                      <span class="col-6 text-end"><strong>Etiquette DPE</strong></span><span class="col-6" id="dpe-class">${item['Etiquette_DPE']}</span>
                      <span class="col-6 text-end"><strong>Adresse</strong></span><span class="col-6" id="adress">${item['Adresse_(BAN)']}</span>
                      <!-- <span class="col-6 text-end">Complément d'adresse</span><span class="col-6">${item['Complément_d\'adresse_logement']}</span> -->
                      <span class="col-6 text-end"><strong>Type de logement</strong></span><span class="col-6" id="building-type">${item['Type_bâtiment']}</span>
                      <!-- <span class="col-6 text-end">Année de construction</span><span class="col-6">${item['Année_construction']}</span> -->
                      <span class="col-6 text-end"><strong>Surface habitable</strong></span><span class="col-6" id="area-size">${item['Surface_habitable_logement']}</span> 
                      <div class="col-6 text-center mx-auto mt-2">
                        <button type="button" class="btn favorite-button">Créer une fiche</button>
                      </div>
                    </div>
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
  }

  onAjouterFavorisClick() {
    // var dpeNumber = document.getElementById("dpe-number")?.innerHTML;
    // var dpeDate = document.getElementById("dpe-date")?.innerHTML;
    // var dpeClass = document.getElementById("dpe-class")?.innerHTML;
    // var adress = document.getElementById("adress")?.innerHTML;
    // var buildingType = document.getElementById("building-type")?.innerHTML;
    // var areaSize = document.getElementById("area-size")?.innerHTML;

    let markerData = JSON.parse(JSON.stringify(this.currentMarker));

    let names: string = markerData['_geopoint'];
    let nameArr = names.split(',');
    
    // this.favoritesService.addFavorite(markerData['N°DPE'], markerData['Date_établissement_DPE'], markerData['Etiquette_DPE'], markerData['Adresse_(BAN)'], markerData['Type_bâtiment'], markerData['Surface_habitable_logement'], nameArr[0], nameArr[1]).subscribe({
    //   next: data => {
    //     console.log(data); 
    //   },
    //   error: error => console.log(error)
    // })
    this.projectService
      .addProjectFromMarker(markerData['Type_bâtiment'], markerData['Nom__commune_(BAN)'], markerData['Adresse_brute'], markerData['Complément_d\'adresse_logement']).pipe(takeUntil(this.destroy))
      .subscribe({next: response => {     
        this.toastService.showFromDpe('La fiche a bien été créé', markerData['Adresse_(BAN)'], response, { delay: 5000 });
      }, error: err => {
        this.toastService.show('Une erreur s\'est produite', 'La fiche existe déjà.', { classname: 'bg-danger text-light', delay: 5000 })
      },
      })
  }
  

}