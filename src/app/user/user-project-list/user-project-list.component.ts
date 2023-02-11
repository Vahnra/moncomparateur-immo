import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-project-list',
  templateUrl: './user-project-list.component.html',
  styleUrls: ['./user-project-list.component.css']
})
export class UserProjectListComponent implements OnInit {

  userId: number;
  isLoggedIn: boolean = false;
  userProjects: Project[];

  constructor (private router: Router, private storageService: StorageService, private userService: UserService, private projectService: ProjectService) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe(userId => {
        if (userId) {
          this.userId = userId;
          this.isLoggedIn = true;
        }
      });
    }

    this.projectService.getUserProjects().subscribe(data => {
      this.userProjects = data;  
      console.log(data);
         
    })
    
  }

  goToMap() {
    this.router.navigate([`/user/${this.userId}/project-map`])
  }
}
