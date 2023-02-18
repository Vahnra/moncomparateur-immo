import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-prospection-telephonique',
  templateUrl: './prospection-telephonique.component.html',
  styleUrls: ['./prospection-telephonique.component.css']
})
export class ProspectionTelephoniqueComponent implements OnInit {

  userId: number;
  user: User;
  isLoggedIn: boolean;
  roles: any;
  
  constructor(private router: Router, private userService: UserService, private storageService: StorageService) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe({
        next: user => {
          if (user) {
            this.user = user;
            this.isLoggedIn = true;
            this.roles = user.status;
          }
        }, error: err => {

        }, complete: () => {

        }
      });
    }
  }

  goToIndex() {
    this.router.navigate([`user/${this.userId}/scenario`])
  }
}
