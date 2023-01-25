import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { GoogleMap } from '@angular/google-maps';

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
    zoom: 10,
    disableDefaultUI: true
  };
  bbox: string;
  bounds: object;
  

  constructor(httpClient: HttpClient) {
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
      // console.log(this.center);
      // console.log(JSON.stringify(this.map.getBounds()))

      // console.log(JSON.parse(JSON.stringify(this.map.getBounds())))

      this.bbox = JSON.parse(JSON.stringify(this.map.getBounds())).west + ',' + JSON.parse(JSON.stringify(this.map.getBounds())).south + ',' + JSON.parse(JSON.stringify(this.map.getBounds())).east + ',' + JSON.parse(JSON.stringify(this.map.getBounds())).north
      console.log(this.bbox);
      
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
      this.bbox = JSON.parse(JSON.stringify(this.map.getBounds())).west + ',' + JSON.parse(JSON.stringify(this.map.getBounds())).south + ',' + JSON.parse(JSON.stringify(this.map.getBounds())).east + ',' + JSON.parse(JSON.stringify(this.map.getBounds())).north
      console.log(this.bbox);
    })
  }

  

  

}
