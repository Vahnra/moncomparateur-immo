import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { catchError, Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { UserService } from './_services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'moncomparateur-immo';
  isLoggedIn: boolean = false;
  userId: number;
  
  routerSubscription: Subscription;
  queryParamsSubscription: Subscription;
  
  constructor(
    private userService: UserService, 
    private router: Router, 
    private storageService: StorageService, 
    private route: ActivatedRoute,
    private location: Location
  ) { }

  // private tokenExpired(token: string) {
  //   const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
  //   return (Math.floor((new Date).getTime() / 1000)) >= expiry;
  // }

  ngOnInit(): void {
    // if (this.tokenExpired(this.storageService.getToken())) {
    //   this.storageService.clean()  
    // }
    
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe(userId => {
        if (userId) {
          this.userId = userId;
          this.isLoggedIn = true;
        }
      });
    } else {
      this.isLoggedIn = false;
    }

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        this.queryParamsSubscription = this.route.queryParams.subscribe(params => {

          // if (this.tokenExpired(this.storageService.getToken())) {
          //   this.storageService.clean()  
          // }
          
          if (this.storageService.isLoggedIn == true) {
            this.userService.getCurrentUser().subscribe({
              next: user => {
                if (user) {
                  window.sessionStorage.setItem("role", user.roles);
                  this.userId = user.id;
                  this.isLoggedIn = true;
                }
              }, error: err => {
                this.isLoggedIn = false;
                this.storageService.clean();
                this.router.navigate(['/'])
              }
            });
          } 
          
        });
      }
    });
  }

  goToUserDashboard() {
    this.router.navigate([`/user/${this.userId}/dashboard`])
  }

  goToRegister() {
    this.router.navigate([`/register`])
  }

  goToLogIn() {
    this.router.navigate([`/login`])
  }

  goToHome() {
    this.router.navigate(['/'])
  }

  goToChatGPT() {
    this.router.navigate([`/user/${this.userId}/chatGPT`])
  }

  goToCalendar() {
    this.router.navigate([`/user/${this.userId}/calendar`])
  }

  goToProject() {
    this.router.navigate([`/user/${this.userId}/project-map`])
  }

  goToDpe() {
    this.router.navigate([`/`])
  }

  goToDvf() {
    this.router.navigate([`/dvf`])
  }

  goToProjectMap() {
    this.router.navigate([`/user/${this.userId}/project-map`])
  }
  
  goToProjectList() {
    this.router.navigate([`/user/${this.userId}/project-list`])
  }

  goToContacts() {
    this.router.navigate([`/user/${this.userId}/contacts`])
  }

  goToProspection() {
    this.router.navigate([`/user/${this.userId}/scenario`])
  }

  goBack(): void {
    this.location.back()
  }
}

