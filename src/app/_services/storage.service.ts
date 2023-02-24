import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

const USER_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private router: Router) { }

  clean(): void {
    window.localStorage.removeItem(USER_KEY);
  }

  // Save user in local storage
  public saveUser(user: any): void {
    window.localStorage.removeItem(USER_KEY);
    window.localStorage.setItem(USER_KEY, user.token);
  }

   // Get user from local storage
   public getToken(): any {
    const token = window.localStorage.getItem(USER_KEY);
    if (token) { 
      return token;
    }
    return {};
  }
  
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem(USER_KEY);
    return authToken !== null ? true : false;
  }

  doLogout() {
    let removeToken = localStorage.removeItem(USER_KEY);
    if (removeToken == null) {
      this.router.navigate(['log-in']);
    }
  }
}
