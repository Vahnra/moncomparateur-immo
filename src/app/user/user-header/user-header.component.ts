import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit{

  userId: any;
  roles: any;
  user: User;
  
  constructor(
    private userService: UserService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private authService: AuthService,
    private toastService: ToastService
    ) { }

    ngOnInit(): void {
      this.userService.getCurrentUser().subscribe({ 
        next: data => {
          this.userId = data.id;
        this.user = data;
        this.roles = data.status;
        }, error: err => {
          console.log(err);
          
        }, complete: () => {
          
        }
      })
    }

  goToUserDashboard() {
    this.router.navigate([`/user/${this.userId}/dashboard`])
  }

  goToSelected(option: any) {
    this.router.navigate([`/user/${this.userId}/${option.value}`])
  }

  logOut() {
    this.authService.doLogout();
  }
}
