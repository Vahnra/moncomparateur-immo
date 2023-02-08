import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/_services/project.service';

@Component({
  selector: 'app-user-project-details-comments',
  templateUrl: './user-project-details-comments.component.html',
  styleUrls: ['./user-project-details-comments.component.css']
})
export class UserProjectDetailsCommentsComponent implements OnInit {

  project: Project;

  constructor(private router: Router, private route: ActivatedRoute, private projectService: ProjectService) { }

  ngOnInit(): void {
    const projectId: string|null = this.route.snapshot.paramMap.get('id');
    this.projectService.getProject(projectId).subscribe(data => {     
      this.project = data;  
    } )
  }
  
  goToDetails() {
    this.router.navigate([`/user/project/${this.project.id}`])
  }

  goToAddComment() {
    this.router.navigate([`/user/project/${this.project.id}/comments/ajouter`])
  }
}
