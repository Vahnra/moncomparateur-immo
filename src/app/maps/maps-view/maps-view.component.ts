import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, map } from 'rxjs/operators';
import { GoogleMap, MapInfoWindow, MapMarker } from '@angular/google-maps';
import { MapsService } from '../maps.service';
import { Dpe } from 'src/app/models/dpe';
import { ReverseGeocoding } from 'src/app/models/reverse-geocoding';

@Component({
  selector: 'app-maps-view',
  templateUrl: './maps-view.component.html',
  styleUrls: ['./maps-view.component.css']
})
export class MapsViewComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  @ViewChild('mapSearchField') searchField: ElementRef;
  @ViewChild(MapInfoWindow, { static: false }) infoWindow: MapInfoWindow;
  
  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    center: {lat: 48.866667, lng:  2.333333},
    zoom: 12,
    disableDefaultUI: true,
    tilt: 0,
    mapId: '77984aa3e0b4e0f3'
  };
  bbox: string;
  bounds: object;
  dpes$: Observable<Dpe[]> = new Observable();
  reverseGeocoding: ReverseGeocoding|undefined;
  markers: any = [];
  test: Dpe;
  zoomLevel: any;

  addMarker(
    latitude: string, 
    longitude: string, 
    markerIcon: string,
    consommation: string, 
    ) {
    this.markers.push({
      position: {
        lat: parseFloat(latitude),
        lng: parseFloat(longitude),
      },
      icon: markerIcon,
      label: {
        color: 'white',
        text: consommation,
      },
      title: consommation,
      options: { 
      
       },
    });
  }

  constructor(public httpClient: HttpClient, private mapsService: MapsService) {
    this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyDAdytsYr9eTg45_wJMa4gtlbdlO0-8dto&libraries=places', 'callback')
        .pipe(
          map(() => true),
          catchError(() => of(false)),
        );
  }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {

    setTimeout(() => {

      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        this.mapsService.refreshDpe(this.map.getCenter()?.lat(), this.map.getCenter()?.lng()).subscribe(dpe => {
   
        });
        this.mapsService.requestReverseGeocoding(this.center.lat, this.center.lng).subscribe((reverseGeocoding: ReverseGeocoding) => {
          // console.log(reverseGeocoding);
        });

      });

      const searchBox = new google.maps.places.SearchBox(
        this.searchField.nativeElement,
      );
      searchBox.addListener('places_changed', () => {
        const places = searchBox.getPlaces();
        if (places?.length === 0) {
          return;
        }
        const bounds = new google.maps.LatLngBounds();
        places?.forEach(place => {
          if (!place.geometry || !place.geometry.location) {
            return
          }
          if (place.geometry.viewport) {
            bounds.union(place.geometry.viewport);
          } else {
            bounds.extend(place.geometry.location)
          }
        });
        this.map.fitBounds(bounds);
        console.log(JSON.stringify(this.map.getBounds()));
        

        this.mapsService.refreshDpe(this.map.getCenter()?.lat(), this.map.getCenter()?.lng()).subscribe(dpe => {
          this.test = JSON.parse(JSON.stringify(dpe));  
          this.markers = [];
          let today = new Date;
          var day = today.getDate();
          var month = today.getMonth() + 1;
          var year = today.getFullYear();
          var datenow = year + "-" + month + "-" + day;
          // console.log(datenow);

          this.mapsService.requestReverseGeocoding(this.map.getCenter()?.lat(), this.map.getCenter()?.lng()).subscribe((reverseGeocoding: ReverseGeocoding) => {
            console.log(reverseGeocoding);
          });

          this.test.results.forEach((item) => {
            if (item['Date_établissement_DPE'] > '2022-09-01') {
              console.log('yes');
              let names: string = item['_geopoint'];
              let nameArr = names.split(',');
              console.log(item['Etiquette_DPE']);
              
              // if (item['Etiquette_DPE'] == 'A') {
              //   this.addMarker(nameArr[0], nameArr[1],'/assets/icons/darkgreen_MarkerA.png', item['Etiquette_DPE']);
              // } 
  
              // if (item['Etiquette_DPE'] == 'B') {
              //   this.addMarker(nameArr[0], nameArr[1],'/assets/icons/green_MarkerB.png', item['Etiquette_DPE']);
              // } 
  
              // if (item['Etiquette_DPE'] == 'C') {
              //   this.addMarker(nameArr[0], nameArr[1],'/assets/icons/paleblue_MarkerC.png', item['Etiquette_DPE']);
              // } 
  
              // if (item['Etiquette_DPE'] == 'D') {
              //   this.addMarker(nameArr[0], nameArr[1],'/assets/icons/darkgreen_MarkerA.png', item['Etiquette_DPE']);
              // } 
  
              // if (item['Etiquette_DPE'] == 'E') {
              //   this.addMarker(nameArr[0], nameArr[1],'/assets/icons/yellow_MarkerD.png', item['Etiquette_DPE']);
              // } 
  
              // if (item['Etiquette_DPE'] == 'F') {
              //   this.addMarker(nameArr[0], nameArr[1],'/assets/icons/orange_MarkerF.png', item['Etiquette_DPE']);
              // } 
              // this.mapsService.requestReverseGeocoding(this.map.getCenter()?.lat(), this.map.getCenter()?.lng()).subscribe((reverseGeocoding: ReverseGeocoding) => {
              //   console.log(reverseGeocoding);
              // });
            }
          })
        });


      })
    }, 1000)
  }

  subject: Subject<any> = new Subject();
  
  refreshDpe() {
    if (this.zoomLevel > 14) {
       
      this.mapsService.refreshDpe(this.map.getCenter()?.lat(), this.map.getCenter()?.lng()).pipe(debounceTime(500)).subscribe(dpe => {
        this.test = JSON.parse(JSON.stringify(dpe));
        // console.log(dpe);
        this.markers = [];
        this.test.results.forEach((item) => {
          if (item['Date_établissement_DPE'] > '2022-09-01') {
            let names: string = item['_geopoint'];
            let nameArr = names.split(',');
            console.log(item['Etiquette_DPE'] == 'D');
            
            if (item['Etiquette_DPE'] == 'A') {
              this.addMarker(nameArr[0], nameArr[1],'/assets/icons/darkgreen_MarkerA.png', item['Etiquette_DPE']);
            } 

            if (item['Etiquette_DPE'] == 'B') {
              this.addMarker(nameArr[0], nameArr[1],'/assets/icons/green_MarkerB.png', item['Etiquette_DPE']);
            } 

            if (item['Etiquette_DPE'] == 'C') {
              this.addMarker(nameArr[0], nameArr[1],'/assets/icons/paleblue_MarkerC.png', item['Etiquette_DPE']);
            } 

            if (item['Etiquette_DPE'] == 'D') {
              this.addMarker(nameArr[0], nameArr[1],'/assets/icons/darkgreen_MarkerA.png', item['Etiquette_DPE']);
            } 

            if (item['Etiquette_DPE'] == 'E') {
              this.addMarker(nameArr[0], nameArr[1],'/assets/icons/yellow_MarkerD.png', item['Etiquette_DPE']);
            } 

            if (item['Etiquette_DPE'] == 'F') {
              this.addMarker(nameArr[0], nameArr[1],'/assets/icons/orange_MarkerF.png', item['Etiquette_DPE']);
            } 
            
          }
        }) 
        this.mapsService.requestReverseGeocoding(this.map.getCenter()?.lat(), this.map.getCenter()?.lng()).subscribe((reverseGeocoding: ReverseGeocoding) => {
          // console.log(reverseGeocoding);
        });
      });

    }
  }

  adress: string;
  surface: string;
  title: string;

  openInfo(marker: MapMarker, title: string, adress: string, surface: string) {
    this.infoWindow.open(marker);
    this.markers.adress = adress;
    this.markers.title = title;
    this.surface = surface;
  }

  
  test2() {
    this.zoomLevel = this.map.getZoom();
  
  }
}