import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { OrderService } from 'src/app/_services/order.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-receipt',
  templateUrl: './user-receipt.component.html',
  styleUrls: ['./user-receipt.component.css']
})
export class UserReceiptComponent implements OnInit {

  userId: any;
  roles: any;
  user: User;
  order: Order[];

  constructor(
    private userService: UserService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private orderService: OrderService,
    private authService: AuthService,
    private toastService: ToastService
    ) { }

  ngOnInit(): void {
    const userId: string|null = this.route.snapshot.paramMap.get('id');
    this.userService.getCurrentUser().subscribe({ 
      next: data => {
      this.userId = data.id;
      this.user = data;
      this.roles = data.status;

      this.orderService.getUserOrders().subscribe({
        next: data => {
          this.order = data;       
        },
        error: err => {
          console.log(err);
          
        },
        complete: () => {
            
        }
      })
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

  goToReceiptDetails(item: Order) {
    this.router.navigate([`/user/${this.userId}/factures/${item.order_id}`])
  }

}
