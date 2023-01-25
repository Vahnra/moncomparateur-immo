import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Dpe } from '../models/dpe';

@Injectable({
  providedIn: 'root'
})
export class MapsService {

  constructor(private httpClient: HttpClient) { }

  private url = 'https://data.ademe.fr/data-fair/api/v1/datasets/dpe-france/lines?page=1&after=1&size=1000&select=%2A&q_mode=simple&bbox=';

  private dpe$: Subject<Dpe> = new Subject();

  refreshDpe(position: string) {
    return this.httpClient.get<Dpe[]>(`${this.url}${position}`);


  }

}
