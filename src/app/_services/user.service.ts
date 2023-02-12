import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStats } from '../models/stats-user';

const AUTH_API = 'http://localhost:8000/api';

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
export class UserService {

  constructor(private http: HttpClient) {  }

  getAllUsers(): Observable<any> {
    return this.http.get(
      AUTH_API + '/user', httpOptions
    );
  }

  getUser(id: string|null): Observable<any> {
    return this.http.get(
      AUTH_API + '/user/' + id, httpOptions
    );
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(
      AUTH_API + '/current-user', httpOptions
    );
  }

  getProjectStats() {
    return this.http.get<UserStats>(
      AUTH_API + '/stats-user', httpOptions
    )
  }

}
