import { Component, HostListener, NgZone, OnDestroy, OnInit } from '@angular/core';
import { ProjectService } from 'src/app/_services/project.service';
import { Location } from '@angular/common'
import * as Leaflet from 'leaflet';
import { latLng, LayerGroup, tileLayer, Map, icon, Icon } from 'leaflet';
import { GeoSearchControl, OpenStreetMapProvider } from 'leaflet-geosearch';
import { Project } from 'src/app/models/project';
import { MapsService } from 'src/app/maps/maps.service';
import { Router } from '@angular/router';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';
import { Subscription, takeUntil } from 'rxjs';
import { User } from 'src/app/models/user';
import { Dpe } from 'src/app/models/dpe';
import { ToastService } from 'src/app/_services/toast.service';

@Component({
  selector: 'app-user-project-map',
  templateUrl: './user-project-map.component.html',
  styleUrls: ['./user-project-map.component.css']
})
export class UserProjectMapComponent implements OnInit, OnDestroy {
  @HostListener('document:click', ['$event']) click(event:any) { 
    if(event.target.classList.contains("fiche-button")){ 
      this.onVoirFicheClick(); 
    }
    if(event.target.classList.contains("favorite-button")){ 
      this.onAjouterFavorisClick(); 
    }
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
  user: User;
  ficheNumber: number;
  date: any;

  userLat1: any;
  userLng1: any;
  userLat2: any;
  userLng2: any;

  test: Dpe;

  markerClusterDataDPE: Leaflet.Marker[] = [];
  lookupDPE: any = [];
  
  customOptions = {
    'minWidth': 300,
  }

  options = {
    layers: [
      tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { maxZoom: 19, subdomains:['mt0','mt1','mt2','mt3'], attribution: '...' })
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
      'Plan par défaut': tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', { 
        maxZoom: 19, 
        subdomains:['mt0','mt1','mt2','mt3']
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

    }
  }

  constructor(
    private projectService: ProjectService, 
    private mapService: MapsService, 
    private zone: NgZone, 
    private router: Router, 
    private storageService: StorageService, 
    private userService: UserService,
    private location: Location,
    private toastService: ToastService) 
  {
    

  }

  ngOnInit() {

    const date = new Date;
    date.setMonth(date.getMonth() - 3);
    this.date = (date).toISOString().split('T')[0];

    if (this.storageService.isLoggedIn) {
      this.userService.getCurrentUser().subscribe({
        next: user => {
          if (user) {
            this.userId = user.id;
            this.isLoggedIn = true;
            this.roles = user.status;
            this.user = user;

            this.apicallSub = this.projectService.getUserProjects().subscribe({
              next: data => {  
                this.ficheNumber = data.length
                data.forEach((element:any) => {
                  this.addMarker(element);
                });
                // console.log(this.markerData);
                
              },
              error: err => {

              },
              complete: () => {
                this.markerClusterData = this.markerData;
                this.markerClusterGroup.addLayers(this.markerClusterData);
              }
              
            })

            if (this.roles == "paid") {
              this.mapService.requestGeocodingDepartment(`${user.postal_code}, France`).subscribe({
                next: data => {
                  let info = JSON.parse(JSON.stringify(data))
                  this.userLat1 = info["data"][0]["bbox_module"][0];
                  this.userLng1 = info["data"][0]["bbox_module"][1];
                  this.userLat2 = info["data"][0]["bbox_module"][2];
                  this.userLng2 = info["data"][0]["bbox_module"][3];
                  this.mapService.refreshDpe(this.userLat1, this.userLng1, this.userLat2, this.userLng2,).subscribe(data => {
        
                    this.test = JSON.parse(JSON.stringify(data))
        
                    this.test.results.forEach((item) => {
        
                      this.addMarkerDPE(item);
                    }) //End of foreach
        
                  }) // End of map service call
                }
              }) // End of geocoding call         
  
              if (user.subscription_options != null) {
                
                user.subscription_options.forEach((element:any) => {
       
                  this.mapService.requestGeocodingDepartment(`${element}, France`).subscribe({
                    next: data => {
                      
                      let info = JSON.parse(JSON.stringify(data))
                      this.userLat1 = info["data"][0]["bbox_module"][0];
                      this.userLng1 = info["data"][0]["bbox_module"][1];
                      this.userLat2 = info["data"][0]["bbox_module"][2];
                      this.userLng2 = info["data"][0]["bbox_module"][3];
                      this.mapService.refreshDpe(this.userLat1, this.userLng1, this.userLat2, this.userLng2,).subscribe(data => {
            
                        this.test = JSON.parse(JSON.stringify(data))
            
                        this.test.results.forEach((item) => {
            
                          this.addMarkerDPE(item);
                        }) //End of foreach
            
                      }) // End of map service call
                    }
                  }) // End of geocoding call
                });
              }

            } else {

              this.mapService.requestGeocodingDepartment(`${user.postal_code}, France`).subscribe({
                next: data => {
                  let info = JSON.parse(JSON.stringify(data))
                  this.userLat1 = info["data"][0]["bbox_module"][0];
                  this.userLng1 = info["data"][0]["bbox_module"][1];
                  this.userLat2 = info["data"][0]["bbox_module"][2];
                  this.userLng2 = info["data"][0]["bbox_module"][3];
                  this.mapService.refreshDpe(this.userLat1, this.userLng1, this.userLat2, this.userLng2,).subscribe(data => {
        
                    this.test = JSON.parse(JSON.stringify(data))
        
                    this.test.results.forEach((item) => {
        
                      this.addFreeMarkerDPE(item);
                    }) //End of foreach
        
                  }) // End of map service call
                }
              }) // End of geocoding call   
            }
            
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
      style: "bar",
      searchLabel: 'Entrer une adresse',

    });
    map.addControl(searchControl);

    navigator.geolocation.getCurrentPosition((position) => {
      map.setView([position.coords.latitude, position.coords.longitude])
    })// End of get current position
    
    
  }

  getUserProjects($event: any) {

    if (!this.enableCall) return;

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
    setTimeout(() => this.enableCall = false, 1000);

  }

  markerClusterReady(group: Leaflet.MarkerClusterGroup) {
    this.markerClusterGroup = group;
    this.pbe = this.markerClusterGroup
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

        if (item.status == 'prospecte') {
          this.markerData.push(Leaflet.marker([test.data[0].latitude, test.data[0].longitude], {
            icon: icon({
              ...Icon.Default.prototype.options,
              iconUrl: 'assets/icons/prospecte.png',
              iconRetinaUrl: 'assets/icons/prospecte.png',
              shadowUrl: 'assets/marker-shadow.png',
              iconSize: [115, 38],
            })
          }).on('click', () => {
            this.zone.run(() => this.onMarkerClick(item))
          }).bindPopup(customPopup, this.customOptions).openPopup());
        }

        if (item.status == 'opportunite') {
          this.markerData.push(Leaflet.marker([test.data[0].latitude, test.data[0].longitude], {
            icon: icon({
              ...Icon.Default.prototype.options,
              iconUrl: 'assets/icons/opportunite.png',
              iconRetinaUrl: 'assets/icons/opportunite.png',
              shadowUrl: 'assets/marker-shadow.png',
              iconSize: [115, 38],
            })
          }).on('click', () => {
            this.zone.run(() => this.onMarkerClick(item))
          }).bindPopup(customPopup, this.customOptions).openPopup());
        }

        if (item.status == 'absent') {
          this.markerData.push(Leaflet.marker([test.data[0].latitude, test.data[0].longitude], {
            icon: icon({
              ...Icon.Default.prototype.options,
              iconUrl: 'assets/icons/absent.png',
              iconRetinaUrl: 'assets/icons/absent.png',
              shadowUrl: 'assets/marker-shadow.png',
              iconSize: [115, 38],
            })
          }).on('click', () => {
            this.zone.run(() => this.onMarkerClick(item))
          }).bindPopup(customPopup, this.customOptions).openPopup());
        }

        if (item.status == 'a-relancer') {
          this.markerData.push(Leaflet.marker([test.data[0].latitude, test.data[0].longitude], {
            icon: icon({
              ...Icon.Default.prototype.options,
              iconUrl: 'assets/icons/a-relancer.png',
              iconRetinaUrl: 'assets/icons/a-relancer.png',
              shadowUrl: 'assets/marker-shadow.png',
              iconSize: [115, 38],
            })
          }).on('click', () => {
            this.zone.run(() => this.onMarkerClick(item))
          }).bindPopup(customPopup, this.customOptions).openPopup());
        }

        if (item.status == 'estimation') {
          this.markerData.push(Leaflet.marker([test.data[0].latitude, test.data[0].longitude], {
            icon: icon({
              ...Icon.Default.prototype.options,
              iconUrl: 'assets/icons/estimation.png',
              iconRetinaUrl: 'assets/icons/estimation.png',
              shadowUrl: 'assets/marker-shadow.png',
              iconSize: [115, 38],
            })
          }).on('click', () => {
            this.zone.run(() => this.onMarkerClick(item))
          }).bindPopup(customPopup, this.customOptions).openPopup());
        }

        if (item.status == 'en-vente') {
          this.markerData.push(Leaflet.marker([test.data[0].latitude, test.data[0].longitude], {
            icon: icon({
              ...Icon.Default.prototype.options,
              iconUrl: 'assets/icons/en-vente.png',
              iconRetinaUrl: 'assets/icons/en-vente.png',
              shadowUrl: 'assets/marker-shadow.png',
              iconSize: [125, 38],
            })
          }).on('click', () => {
            this.zone.run(() => this.onMarkerClick(item))
          }).bindPopup(customPopup, this.customOptions).openPopup());
        }
        
      
      }
    });

  }

  addMarkerDPE(item: any) {
    let names: string = item['_geopoint'];
    let nameArr = names.split(',');

    if (this.isLocationFreeDPE(item['N°DPE']) == true) {

      if (item['Date_établissement_DPE'] > this.date) {

        this.lookupDPE.push(item['N°DPE']);
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

        // this.markerClusterDataDPE.push(Leaflet.marker([+nameArr[0], +nameArr[1]], {
        //   icon: icon({
        //     ...Icon.Default.prototype.options,
        //     iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        //     iconRetinaUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        //     shadowUrl: 'assets/marker-shadow.png',
        //     className: 'test'
        //   })
        // }).on('click', () => {
        //   this.zone.run(() => this.onMarkerClick(item))
        // }).bindPopup(customPopup, this.customOptions).openPopup());

        switch (item['Etiquette_DPE']) {
          case 'A':
            this.dpeMarkerColor(nameArr, item, customPopup, 'assets/icons/marker-A.png');
            break;
        
          case 'B':
            this.dpeMarkerColor(nameArr, item, customPopup, 'assets/icons/marker-B.png');
            break;
        
          case 'C':
            this.dpeMarkerColor(nameArr, item, customPopup, 'assets/icons/marker-C.png');
            break;
        
          case 'D':
            this.dpeMarkerColor(nameArr, item, customPopup, 'assets/icons/marker-D.png');
            break;
        
          case 'E':
            this.dpeMarkerColor(nameArr, item, customPopup, 'assets/icons/marker-E.png');
            break;
        
          case 'F':
            this.dpeMarkerColor(nameArr, item, customPopup, 'assets/icons/marker-F.png');
            break;

          case 'G':
            this.dpeMarkerColor(nameArr, item, customPopup, 'assets/icons/marker-G.png');
            break;
        
          default:
            break;
        }
      
      }
    }
  }

  // Marker dpe color slection
  dpeMarkerColor(nameArr: any, item:any, customPopup: any, letter: any) {
    this.markerClusterDataDPE.push(Leaflet.marker([+nameArr[0], +nameArr[1]], {
      icon: icon({
        ...Icon.Default.prototype.options,
        iconUrl: letter,
        iconRetinaUrl: 'assets/marker-icon-2x.png',
        shadowUrl: 'assets/marker-shadow.png',
      })
    }).on('click', () => {
      this.zone.run(() => this.onMarkerClick(item))
    }).bindPopup(customPopup, this.customOptions).openPopup());
  }

  addFreeMarkerDPE(item: any) {
    let names: string = item['_geopoint'];
    let nameArr = names.split(',');
    const date = new Date;
    date.setMonth(date.getMonth() - 3);
    let desiredDate = date.toLocaleDateString('fr-FR');

    if (this.isLocationFreeDPE(item['N°DPE']) == true) {

      if (item['Date_établissement_DPE'] > this.date) {

        this.lookupDPE.push(item['N°DPE']);
        let customPopup = `
              <div class="row" style="margin-bottom: 0;>
                <div class="col-12" style="margin-bottom: 0;">
                  <div class="card border-0" style="margin-bottom: 0;">
                    <div class="row" >
                      <span class="col-6 text-end"><strong>N°DPE</strong></span><span class="col-6" id="dpe-number">${item['N°DPE']}</span>
                      <span class="col-6 text-end"><strong>Date DPE</strong></span><span class="col-6" id="dpe-date">${item['Date_établissement_DPE']}</span>
                      <span class="col-6 text-end"><strong>Etiquette DPE</strong></span><span class="col-6" id="dpe-class">${item['Etiquette_DPE']}</span>
                      <span class="col-6 text-end"><strong>Adresse</strong></span><span class="col-6" id="adress">Disponible aux abonnés</span>
                      <!-- <span class="col-6 text-end">Complément d'adresse</span><span class="col-6">${item['Complément_d\'adresse_logement']}</span> -->
                      <span class="col-6 text-end"><strong>Type de logement</strong></span><span class="col-6" id="building-type">${item['Type_bâtiment']}</span>
                      <!-- <span class="col-6 text-end">Année de construction</span><span class="col-6">${item['Année_construction']}</span> -->
                      <span class="col-6 text-end"><strong>Surface habitable</strong></span><span class="col-6" id="area-size">${item['Surface_habitable_logement']}</span> 
                      <div class="col-6 text-center mx-auto mt-2">
                        <button disabled type="button" class="btn">Créer une fiche</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>`

        this.markerClusterDataDPE.push(Leaflet.marker([+nameArr[0], +nameArr[1]], {
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

  onFilterChangeType(event: any) {
    this.projectService.getUserProjectsFiltered(event.target.value, this.date).subscribe({
      next: data => {
        this.markerClusterGroup.clearLayers();
        this.markerClusterData = [];
        this.markerData = [];
        this.lookup = [];
        
        data.forEach((element:any) => {
          this.addMarker(element);
        });
        
      }, 
      error: err => {

      },
      complete: () => {
        
        this.markerClusterData = this.markerData;
        this.markerClusterGroup.addLayers(this.markerClusterData);
           
      }
    })
    
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

  isLocationFreeDPE(search: any) {
    for (var i = 0, l = this.lookupDPE.length; i < l; i++) {
      if (this.lookupDPE[i][0] === search) {
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

  onAjouterFavorisClick() {
    // var dpeNumber = document.getElementById("dpe-number")?.innerHTML;
    // var dpeDate = document.getElementById("dpe-date")?.innerHTML;
    // var dpeClass = document.getElementById("dpe-class")?.innerHTML;
    // var adress = document.getElementById("adress")?.innerHTML;
    // var buildingType = document.getElementById("building-type")?.innerHTML;
    // var areaSize = document.getElementById("area-size")?.innerHTML;
    console.log("test");
    
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
      .addProjectFromMarker(markerData['Type_bâtiment'], markerData['Nom__commune_(BAN)'], markerData['Adresse_brute'], markerData['Complément_d\'adresse_logement']).subscribe({next: response => {     
        this.toastService.showFromDpe('La fiche a bien été créé', markerData['Adresse_(BAN)'], response, { delay: 5000 });
      }, error: err => {
        this.toastService.show('Une erreur s\'est produite', 'La fiche existe déjà.', { classname: 'bg-danger text-light', delay: 5000 })
      },
      })
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

  changeToDpeMarker() {
    this.markerClusterGroup.clearLayers();
    this.markerClusterGroup.addLayers(this.markerClusterDataDPE);
  }

  changeToProjectMarker() {
    this.markerClusterGroup.clearLayers();
    this.markerClusterGroup.addLayers(this.markerClusterData);
  }

  goBack() {
    this.location.back()
  }

  onDateChange(event: any) {
    this.lookupDPE = [];
    this.markerClusterDataDPE = [];

    this.date = event.target.value

    if (this.storageService.isLoggedIn) {
      this.userService.getCurrentUser().subscribe({
        next: user => {
          if (user) {
            this.userId = user.id;
            this.isLoggedIn = true;
            this.roles = user.status;
            this.user = user;

            this.apicallSub = this.projectService.getUserProjects().subscribe({
              next: data => {  
                this.ficheNumber = data.length
                data.forEach((element:any) => {
                  this.addMarker(element);
                });
                // console.log(this.markerData);
                
              },
              error: err => {

              },
              complete: () => {
                this.markerClusterData = this.markerData;
                this.markerClusterGroup.addLayers(this.markerClusterData);
              }
              
            })

            if (this.roles == "paid") {
              this.mapService.requestGeocodingDepartment(`${user.postal_code}, France`).subscribe({
                next: data => {
                  let info = JSON.parse(JSON.stringify(data))
                  this.userLat1 = info["data"][0]["bbox_module"][0];
                  this.userLng1 = info["data"][0]["bbox_module"][1];
                  this.userLat2 = info["data"][0]["bbox_module"][2];
                  this.userLng2 = info["data"][0]["bbox_module"][3];
                  this.mapService.refreshDpe(this.userLat1, this.userLng1, this.userLat2, this.userLng2,).subscribe(data => {
        
                    this.test = JSON.parse(JSON.stringify(data))
        
                    this.test.results.forEach((item) => {
        
                      this.addMarkerDPE(item);
                    }) //End of foreach
        
                  }) // End of map service call
                }
              }) // End of geocoding call         
  
              if (user.subscription_options != null) {
                
                user.subscription_options.forEach((element:any) => {
       
                  this.mapService.requestGeocodingDepartment(`${element}, France`).subscribe({
                    next: data => {
                      
                      let info = JSON.parse(JSON.stringify(data))
                      this.userLat1 = info["data"][0]["bbox_module"][0];
                      this.userLng1 = info["data"][0]["bbox_module"][1];
                      this.userLat2 = info["data"][0]["bbox_module"][2];
                      this.userLng2 = info["data"][0]["bbox_module"][3];
                      this.mapService.refreshDpe(this.userLat1, this.userLng1, this.userLat2, this.userLng2,).subscribe(data => {
            
                        this.test = JSON.parse(JSON.stringify(data))
            
                        this.test.results.forEach((item) => {
            
                          this.addMarkerDPE(item);
                        }) //End of foreach
            
                      }) // End of map service call
                    },
                    error: err => {

                    },
                    complete: () => {
                      this.markerClusterGroup.clearLayers();
                      this.markerClusterGroup.addLayers(this.markerClusterDataDPE);
                    }
                  }) // End of geocoding call
                });
              }

            } else {

              this.mapService.requestGeocodingDepartment(`${user.postal_code}, France`).subscribe({
                next: data => {
                  let info = JSON.parse(JSON.stringify(data))
                  this.userLat1 = info["data"][0]["bbox_module"][0];
                  this.userLng1 = info["data"][0]["bbox_module"][1];
                  this.userLat2 = info["data"][0]["bbox_module"][2];
                  this.userLng2 = info["data"][0]["bbox_module"][3];
                  this.mapService.refreshDpe(this.userLat1, this.userLng1, this.userLat2, this.userLng2,).subscribe(data => {
        
                    this.test = JSON.parse(JSON.stringify(data))
        
                    this.test.results.forEach((item) => {
        
                      this.addFreeMarkerDPE(item);
                    }) //End of foreach
        
                  }) // End of map service call
                }
              }) // End of geocoding call   
            }
            
          }
        }, error: err => {

        }, complete: () => {

        }
      });
      
    } 


  }
}
