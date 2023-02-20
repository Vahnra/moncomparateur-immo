import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { FileUploadService } from 'src/app/_services/file-upload.service';
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
    comments: null,
    email: null,
    name: null
  }
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';
  userId: number;
  isLoggedIn: boolean = false;
  projectId: any;
  progress = 0;
  message = '';
  preview = '';
  res = '';

  // image upload properties
  selectedFiles?: FileList;
  currentFile?: File;

  constructor(
    private projectServices: ProjectService, 
    private userService: UserService, 
    private storageService: StorageService, 
    private route: ActivatedRoute, 
    private toastService: ToastService, 
    private uploadService: FileUploadService,
    private router: Router
    ) {}

  ngOnInit(): void {
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe(user => {
        if (user) {
          this.userId = user.id;
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
    const {type, city, adress, phone_numbers, status, complement_adress, email, name} = this.form;
    
    this.projectServices.updateProject(type, city, adress, phone_numbers, status, complement_adress, name, email, this.projectId)
      .subscribe({
        next: data => {

          // Image upload after creation and getting the id
          if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);
        
            if (file) {
              this.currentFile = file;
              this.uploadService.upload(this.currentFile, this.projectId).subscribe({
                next: (event: any) => {
                  // if (event.type === HttpEventType.UploadProgress) {
                  //   this.progress = Math.round((100 * event.loaded) / event.total);
                  // } else if (event instanceof HttpResponse) {
                  //   this.message = event.body.message;
                  //   this.imageInfos = this.uploadService.getFiles();
                  // }
                  // console.log(event);
                  // this.res = event.body.file
                },
                error: (err: any) => {
                  console.log(err);
                  this.progress = 0;
        
                  if (err.error && err.error.message) {
                    this.message = err.error.message;
                  } else {
                    this.message = 'Could not upload the image!';
                  }
        
                  this.currentFile = undefined;
                },
                complete: () => {

                }
              });
            }
        
            this.selectedFiles = undefined;
          } // end of image upload

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
  
  // Image upload function
  selectFile(event: any): void {
    this.message = '';
    this.preview = '';
    this.progress = 0;
    this.selectedFiles = event.target.files;
  
    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);
  
      if (file) {
        this.preview = '';
        this.currentFile = file;
  
        const reader = new FileReader();
  
        reader.onload = (e: any) => {
          this.preview = e.target.result;
        };
  
        reader.readAsDataURL(this.currentFile);
      }
    }
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
