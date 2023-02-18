import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const FAVORITES_API = 'https://orn-chanarong.fr/api/favorites';
const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*',
    'continue': 'yes'
  })
};

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {

  constructor(private http: HttpClient) { }

  // add new favorite
  addFavorite(
    dpeNumber: string,
    dpeDate: string,
    dpeClass: string, 
    adress: string, 
    buildingType: string,
    areaSize: string,
    latitude: string,
    longitude: string
    ): Observable<any> {
    return this.http.post(
      FAVORITES_API + '/add',
      {
        dpeNumber,
        dpeDate,
        dpeClass,
        adress,
        buildingType,
        areaSize,
        latitude,
        longitude
      },
      httpOptions
    )
  }

}
