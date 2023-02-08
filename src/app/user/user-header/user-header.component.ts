import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-header',
  templateUrl: './user-header.component.html',
  styleUrls: ['./user-header.component.css']
})
export class UserHeaderComponent implements OnInit{

  user: any;
  
  constructor(private userService: UserService) {

  }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(data => {

    })
  }
}
