import { Component } from '@angular/core';
import { ProjectService } from 'src/app/_services/project.service';

@Component({
  selector: 'app-user-project',
  templateUrl: './user-project.component.html',
  styleUrls: ['./user-project.component.css']
})
export class UserProjectComponent {

  form: any = {
    type: null,
    city: null,
    adress: null,
    complementAdress: null,
    comments: null
  }
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  constructor(private projectServices: ProjectService) {}

  onSubmit(): void {
    const {type, city, adress, complementAdress, comments} = this.form;
    
    this.projectServices.addProject(type, city, adress, complementAdress, comments)
      .subscribe({
        next: data => {
          console.log(data);
          
        },
        error: error => {
          console.log(error);
          
        }
      })
  }

}
