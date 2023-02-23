import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ToastService } from 'src/app/_services/toast.service';
import { FileUploadService } from 'src/app/_services/file-upload.service';

@Component({
  selector: 'app-user-project-list',
  templateUrl: './user-project-list.component.html',
  styleUrls: ['./user-project-list.component.css']
})
export class UserProjectListComponent implements OnInit {

  displayedColumns: string[] = ['updated_at', 'type', 'city', 'adress', 'status', 'phone_numbers', 'actions'];
  dataSource: MatTableDataSource<Project>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  userId: number;
  isLoggedIn: boolean = false;
  userProjects: Project[];
  ficheNumber: number;
  date: any;

  constructor (
    private router: Router, 
    private storageService: StorageService, 
    private userService: UserService, 
    private projectService: ProjectService, 
    private toastService: ToastService,
    private fileUploadService: FileUploadService
    ) {}

  ngOnInit(): void {

    const date = new Date;
    date.setMonth(date.getMonth() - 3);
    this.date = (date).toISOString().split('T')[0];
    
    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe(userId => {
        if (userId) {
          this.userId = userId;
          this.isLoggedIn = true;
        }
      });
    }

    this.projectService.getUserProjects().subscribe(data => {   
      this.dataSource = new MatTableDataSource(data);   
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort; 
      this.userProjects = data;
      this.ficheNumber = data.length;
      
      this.userProjects.forEach((element:any) => {
        
        if (element.image) {

          this.fileUploadService.getFiles(element.id).subscribe({
            next: response => {
              element.image = response.file;
            },
            error: err => {
      
            },
            complete: () => {}
          })
          
        }

        
      });
    })
    
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  goToMap() {
    this.router.navigate([`/user/${this.userId}/project-map`])
  }

  clickUpdate(id: any) {
    this.router.navigate([`user/${this.userId}/project-update/${id}`]) 
  }

  clickDelete(id: number) {
    this.projectService.deleteProject(id).subscribe({
      next: response => {
        console.log(response);
      }, error: err => {
        console.log(err)
      }, complete: () => {
        this.toastService.show('La fiche a bien été supprimé.', 'Test', {  delay: 3000 });
        this.projectService.getUserProjects().subscribe(data => {   
          this.dataSource = new MatTableDataSource(data);   
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort; 
        })
      }
    })
  }

  onFilterChangeType(event: any) {
    console.log(this.date);
    
    this.projectService.getUserProjectsFiltered(event.target.value, this.date).subscribe({
      next: data => {
       
        this.dataSource = new MatTableDataSource(data);   
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort; 
        this.userProjects = data;
        this.ficheNumber = data.length;
        
      }, 
      error: err => {

      },
      complete: () => {
        
           
      }
    })
    
  }

  onDateChange(event: any) {
    this.date = event.target.value;
  }

  goToDetails(id: any) {
    this.router.navigate([`/user/project/${id}`])
  }

  goToNewProject() {
    this.router.navigate([`/user/${this.userId}/project`])
  }
}
