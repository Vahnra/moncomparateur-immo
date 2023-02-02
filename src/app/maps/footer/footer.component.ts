import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  userId: number;

  constructor(private userService: UserService, private router: Router) {

  }

  ngOnInit(): void {
  
  }

  goToUserDashboard() {
    this.router.navigate([`/user/${this.userId}/dashboard` ])
  }
}
