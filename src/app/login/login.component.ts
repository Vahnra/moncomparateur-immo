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
        console.log(err.error.message);
        if (err.error.message == 'Invalid credentials.') {
          this.toastService.show('Problème de connexion', 'Mot de passe ou identifiant incorrect', { classname: 'bg-danger text-light', delay: 3000 })
        }

        if (err.error.message == 'Merci de vérifier votre mail avant de vous connecter') {
          this.toastService.show('Problème de connexion', 'Merci de vérifier votre mail avant de vous connecter.', { classname: 'bg-danger text-light', delay: 3000 })
        }
        
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
