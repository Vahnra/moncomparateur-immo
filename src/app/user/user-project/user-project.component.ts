import { HttpEventType, HttpResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { FileUploadService } from 'src/app/_services/file-upload.service';
import { ProjectService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';
import { ToastService } from 'src/app/_services/toast.service';
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
    name: null,
    typeFiche: null
  }
  
  isSuccessful = false;
  isSignUpFailed = false;
  errorMessage = '';

  userId: number;
  isLoggedIn: boolean = false;

  // image upload properties
  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  preview = '';
  res = '';

  imageInfos?: Observable<any>;
  
  constructor(
    private projectServices: ProjectService, 
    private router: Router, 
    private storageService: StorageService, 
    private userService: UserService, 
    private uploadService: FileUploadService,
    private toastService: ToastService
    ) {}

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
    const {type, city, adress, complementAdress, comments, phone_numbers, email, calendarTitle, contact, name, typeFiche} = this.form;
    const calendarStart = new Date(this.form.calendarStart)
    
    
    this.projectServices.addProject(type, city, adress, complementAdress, comments, phone_numbers, email, calendarTitle, calendarStart, contact, name, typeFiche)
      .subscribe({
        next: data => {
          console.log(data);

          // Image upload after creation and getting the id
          if (this.selectedFiles) {
            const file: File | null = this.selectedFiles.item(0);
        
            if (file) {
              this.currentFile = file;
              this.uploadService.upload(this.currentFile, data.id).subscribe({
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
          this.toastService.show('La fiche a bien été créé.', `Vous pouvez la retrouver sur la carte ou la liste.`, {  delay: 3000 })   
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
