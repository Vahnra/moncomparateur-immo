import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = 'http://localhost:8000/api/';

const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*',
  })
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  // Inscription
  register(username: string, email: string, password: string, postalCode: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'register',
      {
        username,
        email,
        password,
        postalCode
      },
      httpOptions
    );
  }

  // Connexion
  login(username: string, password: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'login_check',
      {
        username,
        password,
      },
      httpOptions
    );
  }

  
}
