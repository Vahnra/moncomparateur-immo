import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-project-update',
  templateUrl: './user-project-update.component.html',
  styleUrls: ['./user-project-update.component.css']
})
export class UserProjectUpdateComponent implements OnInit {

  project: Project;
  form: any = {
    type: null,
    city: null,
    adress: null,
    phone_numbers: null,
    status: null,
    complement_adress: null,
    comments: null
  }
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  userId: number;
  isLoggedIn: boolean = false;
  projectId: any;

  constructor(private projectServices: ProjectService, private userService: UserService, private storageService: StorageService, private route: ActivatedRoute, private toastService: ToastService, private router: Router) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe(userId => {
        if (userId) {
          this.userId = userId;
          this.isLoggedIn = true;
        }
      });
    }

    this.projectId = this.route.snapshot.paramMap.get('projectId');   
    this.projectServices.getProject(this.projectId).subscribe({next: response => {
      this.project= response;
      this.form = response;
    }, error: err => {
      console.log(err);     
    }, complete: () => {}

    })
  }
  
  onSubmit(): void {
    const {type, city, adress, phone_numbers, status, complement_adress} = this.form;
    
    this.projectServices.updateProject(type, city, adress, phone_numbers, status, complement_adress, this.projectId)
      .subscribe({
        next: data => {
          console.log(data);
          
        },
        error: error => {
          console.log(error);
          
        },
        complete: () => {
          this.toastService.show('La fiche a bien été mis à jour.', this.project.adress, {  delay: 3000 });
          this.router.navigate([`user/${this.userId}/project-list`]);
        }
      })
  }
  
  goToMap() {
    this.router.navigate([`/user/${this.userId}/project-map`])
  }

  goToList() {
    this.router.navigate([`/user/${this.userId}/project-list`])
  }
}
