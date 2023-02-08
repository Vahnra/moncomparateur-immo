import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { CommentsService } from 'src/app/_services/comments.service';
import { ProjectService } from 'src/app/_services/project.service';

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

  constructor(private router: Router, private route: ActivatedRoute, private commentsService: CommentsService, private projectService: ProjectService) {}

  ngOnInit(): void {
    const projectId: string|null = this.route.snapshot.paramMap.get('id');
    this.projectService.getProject(projectId).subscribe(data => {     
      this.project = data;
    } )
  }
  
  onSubmit(): void {
    const {title, text} = this.form;
    this.commentsService.addComment(title, text, this.project.id).subscribe(data => {
      this.router.navigate([`/user/project/${this.project.id}/comments`])
    })

  }
}
