import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  form: any = {
    username: null,
    email: null,
    password: null,
    postalCode: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {
    
  }

  onSubmit(): void {
    const { username, email, password, postalCode } = this.form;

    this.authService.register(username, email, password, postalCode).subscribe({
      next: data => {
        console.log(data);
        if (data.error) {
          this.isSignUpFailed = true;
          this.errorMessage = data.error;
        }
      }
    });
  }
}
