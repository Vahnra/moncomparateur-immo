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
    postalCode: null,
    birthdayDate: null,
    company: null,
    phoneNumbers: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {
    
  }

  onSubmit(): void {
    
    const { username, email, password, postalCode, birthdayDate, company, phoneNumbers } = this.form;

    this.authService.register(username, email, password, postalCode, birthdayDate, company, phoneNumbers).subscribe({
      next: data => {
  
      },
      error: error => {
        
      }
    });
  }

  goToLogIn() {
    this.router.navigate(['/login'])
  }

}
