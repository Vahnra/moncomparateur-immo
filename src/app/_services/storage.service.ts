import { Injectable } from '@angular/core';

const USER_KEY = 'token';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
  }

  // Save user in local storage
  public saveUser(user: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, user.token);
  }

   // Get user from local storage
   public getToken(): any {
    const token = window.sessionStorage.getItem(USER_KEY);
    if (token) { 
      return token;
    }
    return {};
  }
  
  get isLoggedIn(): boolean {
    let authToken = localStorage.getItem(USER_KEY);
    return authToken !== null ? true : false;
  }
}
