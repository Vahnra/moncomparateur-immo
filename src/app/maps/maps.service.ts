import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Dpe } from '../models/dpe';
import { Dvf } from '../models/dvf';
import { ReverseGeocoding } from '../models/reverse-geocoding';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private httpClient: HttpClient) { }

  // private dpeUrl = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-france/lines?page=1&size=1000&select=%2A&q_mode=simple&geo_distance=';
  private dpeUrl = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?page=1&size=1000&geo_distance=';
  private dvfUrl = 'https://api.cquest.org/dvf?';
  private geocodingUrl = 'http://api.positionstack.com/v1/reverse?access_key=936b3bfe42efae87b5705d9df35b9933&query='
  

  private dpe$: Subject<Dpe> = new Subject();

  refreshDpe(latitude: number|undefined, longitude: number|undefined) {
    return this.httpClient.get<Dpe[]>(`${this.dpeUrl}${longitude}:${latitude}:200`);
  }

  refreshDvf(latitude: number|undefined, longitude: number|undefined) {
    return this.httpClient.get<Dvf[]>(`${this.dvfUrl}lat=${latitude}&lon=${longitude}&dist=500`);
  }

  requestReverseGeocoding(latitude: number|undefined, longitude: number|undefined) {
    return this.httpClient.get<ReverseGeocoding>(`${this.geocodingUrl}${latitude},${longitude}`)
  }

}
