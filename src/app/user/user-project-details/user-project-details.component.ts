import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsService } from 'src/app/maps/maps.service';
import { Dpe } from 'src/app/models/dpe';
import { DpeResult } from 'src/app/models/dpe-result';
import { DvfFiche } from 'src/app/models/dvf-fiche';
import { Project } from 'src/app/models/project';
import { FileUploadService } from 'src/app/_services/file-upload.service';
import { ProjectService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';
import { ToastService } from 'src/app/_services/toast.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-project-details',
  templateUrl: './user-project-details.component.html',
  styleUrls: ['./user-project-details.component.css']
})
export class UserProjectDetailsComponent implements OnInit {

  image: '';
  projectId: any;
  project: Project;
  isLoggedIn: boolean = false;
  userId: number;
  latitude: any;
  longitude: any;
  dpe: Dpe;
  dvf: DvfFiche|null;
  etiquette: DpeResult|null;
  options = [
    {value: 'opportunite', text: 'Status : Opportunité'},
    {value: 'prospecte', text: 'Status : Prospecté'},
    {value: 'absent', text: 'Status : Absent'},
    {value: 'a-relancer', text: 'Status : A relancer'},
    {value: 'estimation', text: 'Status : Estimation'},
    {value: 'en-vente', text: 'Status : En vente'},
    {value: 'pas-opportunite', text: 'Status : Pas d\'opportunitée'},
    {value: 'archiver', text: 'Status : Archivé'},
  ]

  constructor(
    private projectService: ProjectService, 
    private route: ActivatedRoute, 
    private router: Router, 
    private storageService: StorageService, 
    private userService: UserService, 
    private mapsService: MapsService,
    private fileUploadService: FileUploadService,
    private toastService: ToastService
    ) { }

  ngOnInit(): void {

    this.projectId = this.route.snapshot.paramMap.get('id');

    this.projectService.getProject(this.projectId).subscribe(data => {     
      this.project = data;
      this.mapsService.requestGeocoding(this.project.adress, this.project.city).subscribe({
        next: data => {
          let properData = JSON.parse(JSON.stringify(data));    
          
          this.mapsService.getDpeFiche(properData.data[0].latitude, properData.data[0].longitude).subscribe(data => {
            data.results.forEach(item => {
              this.etiquette = item;
            })
          });

          this.mapsService.getDvfFiche(properData.data[0].number, properData.data[0].street, properData.data[0].locality, this.project.type).subscribe(data => {
            this.dvf = data;
          });
        },
        error: err => {

        },
        complete: () => {}
      })
    });

    this.fileUploadService.getFiles(this.projectId).subscribe({
      next: response => {
        this.image = response.file;
      },
      error: err => {

      },
      complete: () => {}
    })

    if (this.storageService.isLoggedIn == true) {
      this.userService.getCurrentUser().subscribe(userId => {
        if (userId) {
          this.userId = userId;
          this.isLoggedIn = true;
        }
      });
    }

  }

  goToComments() {
    this.router.navigate([`/user/project/${this.project.id}/comments`])
  }

  goToMap() {
    this.router.navigate([`/user/${this.userId}/project-map`])
  }

  goToList() {
    this.router.navigate([`/user/${this.userId}/project-list`])
  }

  changeStatus(option: any) {
    this.projectService.updateProjectStatus(option.value, this.projectId).subscribe({
      next: response => null,
      error: err => console.log(err),
      complete: () => this.toastService.show('La fiche a bien été mis à jour.', `Le status est maintenant ${option.value}.`, {  delay: 3000 })   
    })
  }

  clickUpdate() {
    this.router.navigate([`user/${this.userId}/project-update/${this.projectId}`]) 
  }
  
  goToNewProject() {
    this.router.navigate([`/user/${this.userId}/project`])
  }
}
