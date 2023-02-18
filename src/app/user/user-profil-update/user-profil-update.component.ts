import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-profil-update',
  templateUrl: './user-profil-update.component.html',
  styleUrls: ['./user-profil-update.component.css']
})
export class UserProfilUpdateComponent {
  
  form: any = {
    username: null,
    email: null,
    postal_code: null,
    birthday_date: null,
    company: null,
    phone_numbers: null
  };
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  userId: number;
  user: User;
  roles: any;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private authService: AuthService, private toastService: ToastService) {

  }

  ngOnInit(): void {
    const userId: string|null = this.route.snapshot.paramMap.get('id');
    this.userService.getCurrentUser().subscribe({ 
      next: data => {

        this.user = data;
        this.form = data;
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
    const {username, email, postal_code, birthday_date, company, phone_numbers} = this.form;
    this.userService.updateUser(username, email, postal_code, birthday_date, company, phone_numbers, this.userId).subscribe({
      next: data => {
        console.log(data);
      }, error: err => {
        console.log(err);    
      }, complete: () => {
        this.toastService.show('Mis a jour', 'Votre profile a bien été mis a jour', {  delay: 3000 });
        this.router.navigate([`user/${this.userId}/paramètres`]);
      }
    })
  }
}
