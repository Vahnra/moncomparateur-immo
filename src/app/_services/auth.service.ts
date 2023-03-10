import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

const AUTH_API = 'https://orn-chanarong.fr/api/';

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
export class AuthService {

  constructor(private http: HttpClient, private router: Router) { }

  // Inscription
  register(username: string, email: string, password: string, postalCode: string, birthdayDate: Date, company: string, phoneNumbers: string, type: string, companyName: string, companyAdress: string, companyCity: string, companyPostalCode: string): Observable<any> {
    return this.http.post(
      AUTH_API + 'register',
      {
        username,
        email,
        password,
        postalCode,
        birthdayDate, 
        company, 
        phoneNumbers, 
        type, 
        companyName, 
        companyAdress, 
        companyCity, 
        companyPostalCode
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

  doLogout() {
    let removeToken = sessionStorage.removeItem('token');
    if (removeToken == null) {
      this.router.navigate(['login'])
    }
  }
  
}
