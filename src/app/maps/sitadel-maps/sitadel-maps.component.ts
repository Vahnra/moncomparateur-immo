import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { CoordinatesData } from 'src/app/models/coordinates-data';
import { MapsService } from '../maps.service';

@Component({
  selector: 'app-sitadel-maps',
  templateUrl: './sitadel-maps.component.html',
  styleUrls: ['./sitadel-maps.component.css']
})
export class SitadelMapsComponent implements OnInit {
  @ViewChild(GoogleMap) map: GoogleMap
  @ViewChild('mapSearchField') searchField: ElementRef;

  apiLoaded: Observable<boolean>;
  center: google.maps.LatLngLiteral;
  markers: any = [];

  
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

  ngOnInit() { }

  ngAfterViewInit(): void {
  
    setTimeout(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      
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
      console.log(this.map.getBounds()?.getSouthWest().lat());
      console.log(this.map.getBounds()?.getSouthWest().lng());
      console.log(this.map.getBounds()?.getNorthEast().lat());
      console.log(this.map.getBounds()?.getNorthEast().lng());
      this.GeoJSON.geometry.coordinates.push([this.map.getBounds()?.getSouthWest().lng(), this.map.getBounds()?.getNorthEast().lat()]);
      this.GeoJSON.geometry.coordinates.push([this.map.getBounds()?.getNorthEast().lng(), this.map.getBounds()?.getNorthEast().lat()]);
      this.GeoJSON.geometry.coordinates.push([this.map.getBounds()?.getNorthEast().lng(), this.map.getBounds()?.getSouthWest().lat()]);
      this.GeoJSON.geometry.coordinates.push([this.map.getBounds()?.getSouthWest().lng(), this.map.getBounds()?.getSouthWest().lat()]);
      this.GeoJSON.geometry.coordinates.push([this.map.getBounds()?.getSouthWest().lng(), this.map.getBounds()?.getNorthEast().lat()]);
      console.log(this.GeoJSON);
      this.mapsService.refreshSitadel(this.GeoJSON);
      
      
    })
  }, 1000)
  }
}
