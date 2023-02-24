import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  userId: string|number;
  user: User;
  roles: string;
  
  opportuniteStats: number;
  prospecteStats: number;
  absentStats: number;
  aRelancerStats: number;
  estimationStats: number;
  enVenteStats: number;
  pasOpportuniteStats: number;
  archiverStats: number;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
    ) { }

  ngOnInit(): void {

    this.userService.getCurrentUser().subscribe({ 
        next: data => {
        this.user = data;
        this.roles = data.status;
        this.userId = data.id;
      }, error: err => {
        console.log(err);
        
      }, complete: () => {
        
      }
    })
    
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
  }

  logOut() {
    this.authService.doLogout();
  }

  goToChatGPT() {
    this.router.navigate([`/user/${this.userId}/chatGPT`])
  }

  goToCalendar() {
    this.router.navigate([`/user/${this.userId}/calendar`])
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

  goToSettings() {
    this.router.navigate([`/user/${this.userId}/paramètres`])
  }
}
