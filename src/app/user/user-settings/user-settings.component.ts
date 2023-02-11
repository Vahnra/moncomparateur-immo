import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit{

  userId = this.route.snapshot.paramMap.get('id');
  user: User;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private authService: AuthService) {

  }

  ngOnInit(): void {
    const userId: string|null = this.route.snapshot.paramMap.get('id');
    this.userService.getUser(userId).subscribe( data => {
      this.user = data;
    })
  }

  logOut() {
    this.authService.doLogout();
  }
  
  goToUserDashboard() {
    this.router.navigate([`/user/${this.userId}/dashboard`])
  }
}
