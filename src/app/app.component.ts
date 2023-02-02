import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './_services/storage.service';
import { UserService } from './_services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'moncomparateur-immo';
  isLoggedIn: boolean;
  userId: number;

  constructor(private userService: UserService, private router: Router, private storageService: StorageService) {

  }

  ngOnInit(): void {
    if (this.storageService.isLoggedIn) {
      this.userService.getCurrentUser().subscribe( userId => {
        this.userId = userId;
      });
      this.isLoggedIn = true;
    }
    
  }

  goToUserDashboard() {
    this.router.navigate([`/user/${this.userId}/dashboard` ])
  }

  goToRegister() {
    this.router.navigate([`/register` ])
  }

  goToLogIn() {
    this.router.navigate([`/login` ])
  }

  goToHome() {
    this.router.navigate(['/'])
  }
}

