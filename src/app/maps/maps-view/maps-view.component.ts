import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleMap } from '@angular/google-maps';
import { MapsService } from '../maps.service';
import { Dpe } from 'src/app/models/dpe';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-maps-view',
  templateUrl: './maps-view.component.html',
  styleUrls: ['./maps-view.component.css']
})
export class MapsViewComponent implements OnInit {
  @ViewChild(GoogleMap) map: GoogleMap
  @ViewChild('mapSearchField') searchField: ElementRef;
  
  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    center: {lat: 48.866667, lng:  2.333333},
    zoom: 12,
    disableDefaultUI: true,
    styles: [
      {
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "elementType": "labels.icon",
        "stylers": [
          {
            "visibility": "off"
          }
        ]
      },
      {
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "elementType": "labels.text.stroke",
        "stylers": [
          {
            "color": "#f5f5f5"
          }
        ]
      },
      {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#bdbdbd"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "poi.park",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#ffffff"
          }
        ]
      },
      {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#757575"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#dadada"
          }
        ]
      },
      {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#616161"
          }
        ]
      },
      {
        "featureType": "road.local",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      },
      {
        "featureType": "transit.line",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#e5e5e5"
          }
        ]
      },
      {
        "featureType": "transit.station",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#eeeeee"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
          {
            "color": "#c9c9c9"
          }
        ]
      },
      {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
          {
            "color": "#9e9e9e"
          }
        ]
      }
    ]
  };
  bbox: string;
  bounds: object;
  dpes$: Observable<Dpe[]> = new Observable();
  markers: any = [
    
  ];
  test: Dpe;

  addMarker(latitude: string, longitude: string, consommation: string) {
    this.markers.push({
      position: {
        lat: latitude,
        lng: longitude,
      },
      label: {
        color: 'white',
        text: consommation,
      },
      title: consommation,
      options: { 
      
       },
    });
  }

  constructor(httpClient: HttpClient, private mapsService: MapsService) {
    // this.apiLoaded = httpClient.jsonp('https://maps.googleapis.com/maps/api/js?key=AIzaSyDAdytsYr9eTg45_wJMa4gtlbdlO0-8dto&libraries=places', 'callback')
    //     .pipe(
    //       map(() => true),
    //       catchError(() => of(false)),
    //     );
  }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      let bound = JSON.parse(JSON.stringify(this.map.getBounds())) 
      // console.log(this.bbox);
      this.bbox = bound.west + ',' + bound.south + ',' + bound.east + ',' + bound.north
      this.mapsService.refreshDpe(this.bbox).subscribe(dpe => {
        // console.log(dpe);
      });
      
    });
  }

  ngAfterViewInit(): void {
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
      // console.log(JSON.parse(JSON.stringify(this.map.getBounds())));
      let bound = JSON.parse(JSON.stringify(this.map.getBounds()))     
      this.bbox = bound.west + ',' + bound.south + ',' + bound.east + ',' + bound.north
      // console.log(this.bbox);
      this.mapsService.refreshDpe(this.bbox).subscribe(dpe => {
        this.test = JSON.parse(JSON.stringify(dpe));
        // console.log(this.test.results);
        this.test.results.forEach((item) => {
          // console.log(item)
          this.addMarker(item['latitude'], item['longitude'], item['classe_consommation_energie'])

        })
      });
    })
  }

  

  

}
