import { Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/_services/project.service';
import * as Leaflet from 'leaflet';
import { latLng, LayerGroup, tileLayer, Map, icon, Icon } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { Project } from 'src/app/models/project';
import { MapsService } from 'src/app/maps/maps.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-project-map',
  templateUrl: './user-project-map.component.html',
  styleUrls: ['./user-project-map.component.css']
})
export class UserProjectMapComponent implements OnInit, OnDestroy {
  @HostListener('document:click', ['$event']) click(event:any) { 
    if(event.target.classList.contains("fiche-button")){ this.onVoirFicheClick(); }
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
  allProjects: Project;
  userId: number;
  isLoggedIn: boolean = false;
  roles: any;
  apicallSub?:Subscription;
  apiMarkerSub?:Subscription;
  
  customOptions = {
    'minWidth': 300,
  }

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
        service: 'WMTS'
      }),
      'Plan IGN': tileLayer('https://wxs.ign.fr/decouverte/geoportail/wmts?' +
        '&REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&TILEMATRIXSET=PM' +
        '&LAYER=GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2&STYLE=normal&FORMAT=image/png' +
        '&TILECOL={x}&TILEROW={y}&TILEMATRIX={z}', {
          maxZoom: 19,
          service: 'WMTS',
        }),
      'Plan cadastre': tileLayer('https://wxs.ign.fr/choisirgeoportail/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE=PCI vecteur&TILEMATRIXSET=PM&FORMAT=image/png&LAYER=CADASTRALPARCELS.PARCELLAIRE_EXPRESS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
        attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
        bounds: [[-75, -180], [81, 180]],
        minZoom: 2,
        maxZoom: 19,
      }),
    },
    overlays: {
 
    }
  }

  constructor(
    private projectService: ProjectService, 
    private mapService: MapsService, 
    private zone: NgZone, 
    private router: Router, 
    private storageService: StorageService, 
    private userService: UserService) 
  {
    this.apicallSub = this.projectService.getUserProjects().subscribe(data => {  
      data.forEach((element:any) => {
        this.addMarker(element);
      });
    })
  }

  ngOnInit() {
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe({
        next: user => {
          if (user) {
            this.userId = user.id;
            this.isLoggedIn = true;
            this.roles = user.status;
          }
        }, error: err => {

        }, complete: () => {

        }
      });
    }

    // this.apicallSub = this.projectService.getUserProjects().subscribe(data => {  
    //   data.forEach((element:any) => {
    //     this.addMarker(element);
    //   });
    // })
  }

  ngAfterViewInit(): void { 

  }

  ngAfterViewChecked() {
    
  }
  
  ngOnDestroy() {
    if(this.apicallSub){
      this.apicallSub.unsubscribe();
      this.apiMarkerSub?.unsubscribe()
    }
  
  }

  onMapReady(map: Map) {
    // add geosearch
    const searchControl = GeoSearchControl({
      provider: this.provider,
      style: "bar"
    });
    map.addControl(searchControl);

    navigator.geolocation.getCurrentPosition((position) => {
      map.setView([position.coords.latitude, position.coords.longitude])
    })// End of get current position
    
  }

  getUserProjects($event: any) {

    // if (!this.enableCall) return;

    this.markerClusterData = this.markerData;
    this.markerClusterGroup.addLayers(this.markerClusterData);
    
    // this.apicallSub = this.projectService.getUserProjects().subscribe(data => {  
    //   data.forEach((element:any) => {
    //     this.addMarker(element);
    //   });
    //   // this.markerClusterGroup.clearLayers();
    //   this.markerClusterData = this.markerData;
    //   this.markerClusterGroup.addLayers(this.markerClusterData);
    // })

    // this.enableCall = false;
    
    // var popup = this.map.layer.getPopup();
    // setTimeout(() => this.enableCall = false, 4000);

  }

  markerClusterReady(group: Leaflet.MarkerClusterGroup) {
    this.markerClusterGroup = group;
  }

  addMarker(item: any) {

    this.apiMarkerSub = this.mapService.requestGeocoding(item.adress, item.city).subscribe(data => {
      
      let test = JSON.parse(JSON.stringify(data));     
      let nameArr = [test.data[0].latitude, test.data[0].longitude];

      if (this.isLocationFree(nameArr) == true) {

        this.lookup.push([test.data[0].latitude, test.data[0].longitude]);

        let customPopup = `
              <div class="row" style="margin-bottom: 0;>
                <div >
                  <div class="card" >
                      <h3>${item.city}</h3>
                      <div>${item.adress}</div>
                      <div>${item.complement_adress}</div>
                      <div>${item.created_at}</div>
                      <div class="col-6 text-center mx-auto mt-3">
                        <button type="button" class="btn fiche-button">Voir la fiche</button>
                      </div>       
                  </div>
                </div>
              </div>`

        this.markerData.push(Leaflet.marker([test.data[0].latitude, test.data[0].longitude], {
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
    });

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

  onMarkerClick(item: any) {
    this.currentMarker = item;
  }

  onVoirFicheClick() {
    let markerData = JSON.parse(JSON.stringify(this.currentMarker));
    this.router.navigate([`/user/project/${markerData.id}`])
  }

  goToListe() {
    this.router.navigate([`/user/${this.userId}/project-list`])
  }

  goToNewProject() {
    this.router.navigate([`/user/${this.userId}/project`])
  }

  refresh() {
    window.location.reload();
  }
}
