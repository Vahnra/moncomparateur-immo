import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { StorageService } from '../_services/storage.service';
import { ToastService } from '../_services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  form: any = {
    username: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router, private storageService: StorageService, private toastService: ToastService) { }

  onSubmit(): void {
    const { username, password } = this.form;

    this.authService.login(username, password).subscribe({
      next: data => {
        this.storageService.saveUser(data);
        
      },
      error: err => {
        this.toastService.show('Problème de connexion', 'Vos identifiants ne sont pas corrects.', { classname: 'bg-danger text-light', delay: 3000 })
      },
      complete: () => {
        this.toastService.show('Connexion réussi', 'Vous êtes maintenant connecté', { delay: 3000});
        this.router.navigate([`/`])
          // .then(() => {
          //   window.location.reload();
          // });
      }
    });
  }

  goToRegister() {
    this.router.navigate([`/register` ])
  }
}
