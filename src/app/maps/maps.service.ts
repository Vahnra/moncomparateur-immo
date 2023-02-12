import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Dpe } from '../models/dpe';
import { Dvf } from '../models/dvf';
import { DvfFiche } from '../models/dvf-fiche';
import { ReverseGeocoding } from '../models/reverse-geocoding';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*',
    'continue': 'continue'
  })
};

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private httpClient: HttpClient) { }

  // private dpeUrl = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-france/lines?page=1&size=1000&select=%2A&q_mode=simple&geo_distance=';
  private dpeUrl = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?page=1&size=10000&select=N%C2%B0DPE%2CDate_%C3%A9tablissement_DPE%2CAdresse_(BAN)%2CAdresse_brute%2CNom__commune_(BAN)%2CCode_postal_(BAN)%2CEtiquette_DPE%2CSurface_habitable_logement%2CCompl%C3%A9ment_d\'adresse_logement%2CType_b%C3%A2timent%2C_geopoint%2CAnnée_construction&geo_distance=';
  private dpeFicheUrl = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-v2-logements-existants/lines?page=1&size=1&select=N%C2%B0DPE%2CDate_%C3%A9tablissement_DPE%2CAdresse_(BAN)%2CEtiquette_DPE%2CSurface_habitable_logement%2CCompl%C3%A9ment_d\'adresse_logement%2CType_b%C3%A2timent%2C_geopoint%2CAnnée_construction&geo_distance=';
  private dvfUrl = 'https://api.cquest.org/dvf?';
  private geocodingUrl = 'https://api.positionstack.com/v1/reverse?access_key=936b3bfe42efae87b5705d9df35b9933&query=';
  private sitadelUrl = 'https://api-preprod.sogefi-sig.com/2Besqie6xBzrxMj85psAPXm7cLy7A57eoEx/audrso/v2/open/dossiers/intersects';
  private decoupageAdministratifUrl = 'https://geo.api.gouv.fr/communes?codePostal=';
  private cadastreUrl = 'https://apicarto.ign.fr/api/cadastre/division?code_insee=';
  private dvfFiche = 'http://localhost:8000/api/dvf';

  private dpe$: Subject<Dpe> = new Subject();

  refreshDpe(latitude: number|undefined, longitude: number|undefined) {
    return this.httpClient.get<Dpe[]>(`${this.dpeUrl}${longitude}:${latitude}:1000`);
  }

  getDpeFiche(latitude: number|undefined, longitude: number|undefined) {
    return this.httpClient.get<Dpe>(`${this.dpeFicheUrl}${longitude}:${latitude}:20`);
  }

  getDvfFiche(streetNumber: any, street: any, city: any, type: any) {
    return this.httpClient.get<DvfFiche>(`${this.dvfFiche}?number=${streetNumber}&street=${street}&city=${city}&type=${type}`, httpOptions)
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

  requestGeocoding(adress: string, city: string) {
    return this.httpClient.get(`https://api.positionstack.com/v1/forward?access_key=936b3bfe42efae87b5705d9df35b9933&query=${adress} ${city}`)
  }
 
}
