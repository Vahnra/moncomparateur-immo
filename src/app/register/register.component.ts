import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { ToastService } from '../_services/toast.service';

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
    confirmPassword: null,
    postalCode: null,
    birthdayDate: null,
    company: null,
    phoneNumbers: null,
    type: null,
    companyName: null,
    companyAdress: null,
    companyCity: null,
    companyPostalCode: null,
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private toastService: ToastService) { }

  onSubmit(): void {
    
    const { username, email, password, postalCode, birthdayDate, company, phoneNumbers, type, companyName, companyAdress, companyCity, companyPostalCode } = this.form;

    this.authService.register(username, email, password, postalCode, birthdayDate, company, phoneNumbers, type, companyName, companyAdress, companyCity, companyPostalCode).subscribe({
      next: data => {
  
      }, error: error => {
        
      }, complete: () => {
        this.toastService.show('Inscription', 'Votre compte a bien été créé, merci de vérifier vos mails', {  delay: 3000 });
        this.router.navigate([`login`]);
      }
    });
  }

  goToLogIn() {
    this.router.navigate(['/login'])
  }

}
