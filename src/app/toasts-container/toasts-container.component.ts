import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastService } from '../_services/toast.service';

@Component({
  selector: 'app-toasts-container',
  templateUrl: './toasts-container.component.html',
  styleUrls: ['./toasts-container.component.css']
})
export class ToastsContainerComponent {

  constructor(public toastService: ToastService, private router: Router) {}
  
  goToAddedFiche(button: any) {
    this.router.navigate([`/user/project/${button}`]);
  }
}
