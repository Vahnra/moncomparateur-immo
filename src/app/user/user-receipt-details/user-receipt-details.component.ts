import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Order } from 'src/app/models/order';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { OrderService } from 'src/app/_services/order.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-receipt-details',
  templateUrl: './user-receipt-details.component.html',
  styleUrls: ['./user-receipt-details.component.css']
})
export class UserReceiptDetailsComponent implements OnInit {

  userId: any;
  roles: any;
  user: User;
  order: Order;
  tax: number;

  constructor(
    private userService: UserService, 
    private router: Router, 
    private route: ActivatedRoute, 
    private orderService: OrderService,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    const receiptId: string|number|null = this.route.snapshot.paramMap.get('receiptId');
    this.userService.getCurrentUser().subscribe({ 
      next: data => {
      this.userId = data.id;
      this.user = data;
      this.roles = data.status;

      this.orderService.getUserSpecificOrder(receiptId).subscribe({
        next: data => {
          console.log(data);
          this.order = data;
          this.tax = data.price * 0.20;
        },
        error: err => {

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

  goToSelected(option: any) {
    this.router.navigate([`/user/${this.userId}/${option.value}`])
  }   
}
