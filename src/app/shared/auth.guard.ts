import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public storageService: StorageService, public router: Router) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.storageService.isLoggedIn !== true) {
      window.alert("Access not allowed!");
      this.router.navigate(['login'])
    }
    return true;
  }
  
}
