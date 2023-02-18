import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-password-update',
  templateUrl: './user-password-update.component.html',
  styleUrls: ['./user-password-update.component.css']
})
export class UserPasswordUpdateComponent {

  form = {
    oldPassword: null,
    password: null,
    confirmPassword: null
  }
  userId: number;
  user: User;
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  roles: any;

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
      this.user = data;
      this.roles = data.status;
      this.userId = data.id;
    }, error: err => {
      console.log(err);
      
    }, complete: () => {
      
    }
  })
  }

  logOut() {
    this.authService.doLogout();
  }
  
  goToUserDashboard() {
    this.router.navigate([`/user/${this.userId}/dashboard`])
  }

  goToPayments() {
    this.router.navigate([`/user/${this.userId}/payment`])
  }

  goToSelected(option: any) {
    this.router.navigate([`/user/${this.userId}/${option.value}`])
  }
  
  onSubmit() {
    const { oldPassword, password} = this.form;
    this.userService.updatePassword(oldPassword, password, this.userId).subscribe({
      next: response => {
        console.log(response);
        
      }, error: err => {
        console.log(err);
      }, complete: () => {
        this.toastService.show('Mis a jour', 'Votre mot de passe a bien été mis a jour', {  delay: 3000 });
        this.router.navigate([`user/${this.userId}/paramètres`]);
      }
    })
  }
}
