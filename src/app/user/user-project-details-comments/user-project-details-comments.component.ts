import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-project-details-comments',
  templateUrl: './user-project-details-comments.component.html',
  styleUrls: ['./user-project-details-comments.component.css']
})
export class UserProjectDetailsCommentsComponent implements OnInit {

  project: Project;
  isLoggedIn: boolean = false;
  userId: number;
  
  constructor(private router: Router, private route: ActivatedRoute, private projectService: ProjectService, private storageService: StorageService, private userService: UserService) { }

  ngOnInit(): void {
    const projectId: string|null = this.route.snapshot.paramMap.get('id');
    this.projectService.getProject(projectId).subscribe(data => {     
      this.project = data;  
    } )

    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe(userId => {
        if (userId) {
          this.userId = userId;
          this.isLoggedIn = true;
        }
      });
    }
  }
  
  goToDetails() {
    this.router.navigate([`/user/project/${this.project.id}`])
  }

  goToAddComment() {
    this.router.navigate([`/user/project/${this.project.id}/comments/ajouter`])
  }

  goToMap() {
    this.router.navigate([`/user/${this.userId}/project-map`])
  }
}
