import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit {

  constructor(private userService: UserService, private router: Router, private route: ActivatedRoute,) {

  }

  ngOnInit(): void {
    const userId: string|null = this.route.snapshot.paramMap.get('id');
    this.userService.getUser(userId).subscribe( data => {
      console.log(data);
      
    })
  }
}
