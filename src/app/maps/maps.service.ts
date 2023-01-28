import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Dpe } from '../models/dpe';
import { Dvf } from '../models/dvf';
import { ReverseGeocoding } from '../models/reverse-geocoding';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'accepts': '*/*'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private httpClient: HttpClient) { }

  // private dpeUrl = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-france/lines?page=1&size=1000&select=%2A&q_mode=simple&geo_distance=';
  private dpeUrl = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?page=1&size=1000&geo_distance=';
  private dvfUrl = 'https://api.cquest.org/dvf?';
  private geocodingUrl = 'http://api.positionstack.com/v1/reverse?access_key=936b3bfe42efae87b5705d9df35b9933&query='
  private sitadelUrl = 'https://api-preprod.sogefi-sig.com/2Besqie6xBzrxMj85psAPXm7cLy7A57eoEx/audrso/v2/open/dossiers/intersects'
  private decoupageAdministratifUrl = 'https://geo.api.gouv.fr/communes?codePostal='
  private cadastreUrl = 'https://apicarto.ign.fr/api/cadastre/division?code_insee='
  

  private dpe$: Subject<Dpe> = new Subject();

  refreshDpe(latitude: number|undefined, longitude: number|undefined) {
    return this.httpClient.get<Dpe[]>(`${this.dpeUrl}${longitude}:${latitude}:250`);
  }

  refreshDvf(latitude: number|undefined, longitude: number|undefined) {
    return this.httpClient.get<Dvf[]>(`${this.dvfUrl}lat=${latitude}&lon=${longitude}&dist=500`);
  }

  refreshSitadel(geoData: object) {
    return this.httpClient.post(`${this.refreshSitadel}`, geoData, httpOptions);
  }

  getInseeCode(postalCode: number|string) {
    return this.httpClient.get(`${this.decoupageAdministratifUrl}${postalCode}`);
  }

  getCadastre(codeCommune: number|string) {
    return this.httpClient.get(`${this.cadastreUrl}${codeCommune}`);
  }

  requestReverseGeocoding(latitude: number|undefined, longitude: number|undefined) {
    return this.httpClient.get<ReverseGeocoding>(`${this.geocodingUrl}${latitude},${longitude}&limit=1`)
  }


 
}
