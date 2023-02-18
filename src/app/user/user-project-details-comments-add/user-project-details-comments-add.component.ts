import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { User } from 'src/app/models/user';
import { CommentsService } from 'src/app/_services/comments.service';
import { ProjectService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-project-details-comments-add',
  templateUrl: './user-project-details-comments-add.component.html',
  styleUrls: ['./user-project-details-comments-add.component.css']
})
export class UserProjectDetailsCommentsAddComponent implements OnInit{

  project: Project;
  form: any = {
    title: null,
    text: null,
  }
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  userId: number;
  user: User;
  roles: any;
  isLoggedIn: boolean = false;

  constructor(private router: Router, private route: ActivatedRoute, private commentsService: CommentsService, private projectService: ProjectService, private userService: UserService, private storageService: StorageService) {}

  ngOnInit(): void {
    const projectId: string|null = this.route.snapshot.paramMap.get('id');
    
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe({
        next: user => {
        if (user) {
          this.userId = user.id;
          this.isLoggedIn = true;
          this.roles = user.status;
            if (user.status == 'paid') {
              this.roles = 'paid';
              this.projectService.getProject(projectId).subscribe(data => {     
                this.project = data;  
              } )
            }  
          }
        }
      });
    }
  }
  
  onSubmit(): void {
    const {title, text} = this.form;
    this.commentsService.addComment(title, text, this.project.id).subscribe(data => {
      this.router.navigate([`/user/project/${this.project.id}/comments`])
    })

  }

  goToMap() {
    this.router.navigate([`/user/${this.userId}/project-map`])
  }

  goToList() {
    this.router.navigate([`/user/${this.userId}/project-list`])
  }

  goToNewProject() {
    this.router.navigate([`/user/${this.userId}/project`])
  }
}
