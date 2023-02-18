import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { OrderService } from 'src/app/_services/order.service';
import { PaymentService } from 'src/app/_services/payment.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.css']
})
export class UserSettingsComponent implements OnInit{
  @ViewChild('closeModal') closeModal: ElementRef

  userId: any;
  roles: any;
  user: User;
  order: Order;
  nextSubDate: any;

  constructor(
    private userService: UserService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private authService: AuthService,
    private orderService: OrderService,
    private paymentService: PaymentService,
    private toastService: ToastService
    ) { }

  ngOnInit(): void {
    const userId: string|null = this.route.snapshot.paramMap.get('id');
    this.userService.getCurrentUser().subscribe({ 
      next: data => {
        this.userId = data.id;
        this.user = data;
        this.roles = data.status;

        this.orderService.getUserLastOrder().subscribe({
          next: data => {
            var subDate = new Date(data.created_at);
            this.nextSubDate = new Date(subDate.setMonth(subDate.getMonth() + 1));
            this.order = data;     
          },
          error: err => {
            console.log(err);
            
          },
          complete: () => {
              
          }
        })
      }, 
      error: err => {
        console.log(err);
        
      }, 
      complete: () => {
        
      }
    })
  }

  cancelSubscription() {
    this.paymentService.cancelSubscription().subscribe({
      next: response => {
        this.closeModal.nativeElement.click();
        console.log(response);   
      },error: err => {
        this.toastService.show('Attention', `Une erreur s'est produite, veuillez contacter le service client.`, {  delay: 3000 });
        this.closeModal.nativeElement.click();
      },complete: () => {
        this.toastService.show('Abonnement annuler.', `Votre abonnement s'achèvera le 18/03/2023`, {  delay: 3000 });
        this.closeModal.nativeElement.click();
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

  goToProfilUpdate() {
    this.router.navigate([`/user/${this.userId}/profile-update`])
  }
}
