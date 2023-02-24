import { Component } from '@angular/core';
import { Location } from '@angular/common'
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { catchError, Subscription } from 'rxjs';
import { StorageService } from './_services/storage.service';
import { UserService } from './_services/user.service';
import { User } from './models/user';
import { AuthService } from './_services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'moncomparateur-immo';
  isLoggedIn: boolean = false;
  userId: number;
  user: User;
  roles: any;

  opportuniteStats: number;
  prospecteStats: number;
  absentStats: number;
  aRelancerStats: number;
  estimationStats: number;
  enVenteStats: number;
  pasOpportuniteStats: number;
  archiverStats: number;
  
  routerSubscription: Subscription;
  queryParamsSubscription: Subscription;
  
  constructor(
    private userService: UserService, 
    private router: Router, 
    private storageService: StorageService, 
    private route: ActivatedRoute,
    private authService: AuthService,
    private location: Location
  ) { }


  ngOnInit(): void {
    
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe(user => {
        if (user.id) {
          this.userId = user.id;
          this.isLoggedIn = true;
          this.user = user;
          this.roles = user.status;
        }
        this.userService.getProjectStats().subscribe({
          next: data => {
            this.opportuniteStats = data["0"];
            this.prospecteStats = data["1"];
            this.absentStats = data["2"];
            this.aRelancerStats = data["3"];
            this.estimationStats = data["4"];
            this.enVenteStats = data["5"];
            this.pasOpportuniteStats = data["6"];
            this.archiverStats = data["7"];
            console.log(data);
            
          }, error: err => {
            console.log(err);
          }, complete: () => {}
        })
      });
    } else {
      this.isLoggedIn = false;
    }

    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {

        this.queryParamsSubscription = this.route.queryParams.subscribe(params => {
          
          if (this.storageService.isLoggedIn == true) {
            this.userService.getCurrentUser().subscribe({
              next: user => {
                if (user) {
                  window.sessionStorage.setItem("role", user.roles);
                  this.userId = user.id;
                  this.isLoggedIn = true;
                  this.user = user;
                }
                this.userService.getProjectStats().subscribe({
                  next: data => {
                    this.opportuniteStats = data["0"];
                    this.prospecteStats = data["1"];
                    this.absentStats = data["2"];
                    this.aRelancerStats = data["3"];
                    this.estimationStats = data["4"];
                    this.enVenteStats = data["5"];
                    this.pasOpportuniteStats = data["6"];
                    this.archiverStats = data["7"];
                    console.log(data);
                    
                  }, error: err => {
                    console.log(err);
                  }, complete: () => {}
                })
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

  goToNewProject() {
    this.router.navigate([`/user/${this.userId}/project`])
  }

  logOut() {
    this.authService.doLogout();
  }
}

