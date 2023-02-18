import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStats } from '../models/stats-user';
import { User } from '../models/user';

const AUTH_API = 'https://orn-chanarong.fr/api';

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
    return this.http.get<User>(
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

  updateUser(
    username: string,
    email: string,
    postalCode: string,
    birthdayDate: string,
    company: string,
    phoneNumbers: string,
    userId: number|string
    ) {
    return this.http.put(
      AUTH_API + `/user/${userId}`, {
        username,
        email,
        postalCode,
        birthdayDate,
        company,
        phoneNumbers
      }, httpOptions
    )
  }

  updatePassword(
    oldPassword: any,
    password: any,
    userId: number|string
  ) {
    return this.http.put(
      AUTH_API + `/user-password/${userId}`, {
        oldPassword,
        password
      }, httpOptions
    )
  }
}
