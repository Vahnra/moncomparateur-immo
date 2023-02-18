import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { PaymentService } from 'src/app/_services/payment.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-payment',
  templateUrl: './user-payment.component.html',
  styleUrls: ['./user-payment.component.css']
})
export class UserPaymentComponent {
  
  form : any = {
    option: 0,
    type: 1,
    price: 18.99
  }

  optionSelected:any = '';
  abonnementSelected:any = 1;
  userId = this.route.snapshot.paramMap.get('id');
  user: User;

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute, private authService: AuthService, private paymentService: PaymentService) {

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

  onSubmit(): void {
    const {option, type} = this.form;
    
    this.paymentService.addPayment(option, type).subscribe({
      next: (response:any) => {
        window.location.href = response;
      }, error: err => {

      }, complete: () => {
           
      }
    })
  }

  ChangeOption(event:any) {
    this.optionSelected = event.value;   
  }

  ChangeAbonnement(event:any) {
    this.abonnementSelected = event.value;   
  }
}
