import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-project',
  templateUrl: './user-project.component.html',
  styleUrls: ['./user-project.component.css']
})
export class UserProjectComponent implements OnInit {

  form: any = {
    type: null,
    city: null,
    adress: null,
    complementAdress: null,
    comments: null,
    phone_numbers: null,
    email: null,
    calendarTitle: null,
    calendarStart: null,
    contact: null,
    name: null
  }
  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  userId: number;
  isLoggedIn: boolean = false;

  constructor(private projectServices: ProjectService, private router: Router, private storageService: StorageService, private userService: UserService) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe(userId => {
        if (userId) {
          this.userId = userId;
          this.isLoggedIn = true;
        }
      });
    }
  }

  onSubmit(): void {
    const {type, city, adress, complementAdress, comments, phone_numbers, email, calendarTitle, contact, name} = this.form;
    const calendarStart = new Date(this.form.calendarStart)
    
    this.projectServices.addProject(type, city, adress, complementAdress, comments, phone_numbers, email, calendarTitle, calendarStart, contact, name)
      .subscribe({
        next: data => {
          console.log(data);
          
        },
        error: error => {
          console.log(error);
          
        }
      })

  }

  goToNewProject() {
    this.router.navigate([`/user/${this.userId}/project`])
  }

  goToMap() {
    this.router.navigate([`/user/${this.userId}/project-map`])
  }

  goToList() {
    this.router.navigate([`/user/${this.userId}/project-list`])
  }
}
