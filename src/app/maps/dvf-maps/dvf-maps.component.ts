import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleMap } from '@angular/google-maps';
import { MapsService } from '../maps.service';
import { Dvf } from 'src/app/models/dvf';
import { ReverseGeocoding } from 'src/app/models/reverse-geocoding';
import { CoordinatesData } from 'src/app/models/coordinates-data';

@Component({
  selector: 'app-dvf-maps',
  templateUrl: './dvf-maps.component.html',
  styleUrls: ['./dvf-maps.component.css']
})
export class DvfMapsComponent implements OnInit {
  @ViewChild(GoogleMap) map: GoogleMap
  @ViewChild('mapSearchField') searchField: ElementRef;

  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral;
  options: google.maps.MapOptions = {
    center: {lat: 48.866667, lng:  2.333333},
    zoom: 12,
    disableDefaultUI: true,
    minZoom: 10,
    mapId: '77984aa3e0b4e0f3'
  };
  bbox: string;
  markers: any = [];
  test: Dvf;
  commune: string;
  codeCommune: string;
  markerClustererImagePath = 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m';

  addMarker(latitude: string, longitude: string, valeur_fonciere: string) {
    this.markers.push({
      position: {
        lat: latitude,
        lng: longitude,
      },
      label: {
        color: 'white',
        text: valeur_fonciere,
      },
      title: valeur_fonciere,
      options: { 
      
       },
    });
  }

  GeoJSON = {
    type: 'Feature',
    geometry: {
        type: 'Polygon',
        coordinates: [] as CoordinatesData[]
    },
    properties: {
      fields: "geometry",
      limit: 100
    }
  };

  constructor(httpClient: HttpClient, private mapsService: MapsService) {
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
      // let bound = JSON.parse(JSON.stringify(this.map.getBounds())) 
      // console.log(this.bbox);
      // this.bbox = bound.west + ',' + bound.south + ',' + bound.east + ',' + bound.north
      this.mapsService.refreshDvf(this.map.getCenter()?.lat(), this.map.getCenter()?.lng()).subscribe(dvf => {
        // console.log(dpe);
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
      // console.log(this.map.getCenter()?.lat());
      this.mapsService.refreshDvf(this.map.getCenter()?.lat(), this.map.getCenter()?.lng()).subscribe(dvf => {    
        this.test = JSON.parse(JSON.stringify(dvf))
        // console.log(test.features);
        this.test.features.forEach((item) => {
          // console.log(item['properties'])
          this.addMarker(item['geometry']['coordinates'][1], item['geometry']['coordinates'][0], item['properties']['code_voie'])
        })   
      })

      this.mapsService.requestReverseGeocoding(this.map.getCenter()?.lat(), this.map.getCenter()?.lng()).subscribe((reverseGeocoding: ReverseGeocoding) => {
        this.commune = reverseGeocoding.data[0].postal_code;
        // console.log(this.commune);
        
        this.mapsService.getInseeCode(this.commune).subscribe(data => {
          // console.log(JSON.parse(JSON.stringify(data))[0].code);
          this.codeCommune = JSON.parse(JSON.stringify(data))[0].code;
          this.mapsService.getCadastre(this.codeCommune).subscribe(data => {
            console.log(data);
            this.map.data.addGeoJson(data);
   
          })
        });   
      });
      
      
      
    })
  }, 1000)
  }

}
