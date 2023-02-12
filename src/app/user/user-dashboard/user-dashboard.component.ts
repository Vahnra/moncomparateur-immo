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

  userId = this.route.snapshot.paramMap.get('id');
  user: User;
  prospectionStats: number;
  estimationsStats: number;
  mandatsStats: number;
  visitesStats: number;
  contreVisitesStats: number;

  constructor(
    private userService: UserService,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
    ) { }

  ngOnInit(): void {
    const userId: string|null = this.route.snapshot.paramMap.get('id');
    this.userService.getUser(userId).subscribe( data => {
      this.user = data;
    })
    this.userService.getProjectStats().subscribe({
      next: data => {
        this.prospectionStats = data["0"];
        this.estimationsStats = data["1"];
        this.mandatsStats = data["2"];
        this.visitesStats = data["3"];
        this.contreVisitesStats = data["4"];
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
