import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MapsService } from 'src/app/maps/maps.service';
import { Dpe } from 'src/app/models/dpe';
import { DpeResult } from 'src/app/models/dpe-result';
import { DvfFiche } from 'src/app/models/dvf-fiche';
import { Project } from 'src/app/models/project';
import { ProjectService } from 'src/app/_services/project.service';
import { StorageService } from 'src/app/_services/storage.service';
import { UserService } from 'src/app/_services/user.service';

@Component({
  selector: 'app-user-project-details',
  templateUrl: './user-project-details.component.html',
  styleUrls: ['./user-project-details.component.css']
})
export class UserProjectDetailsComponent implements OnInit {

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
    {value: 'prospection', text: 'Status : Prospection'},
    {value: 'estimation', text: 'Status : Estimation'},
    {value: 'mandat', text: 'Status : Mandat'},
    {value: 'visite', text: 'Status : Visite'},
    {value: 'contre-visite', text: 'Status : Contre Visite'},
  ]

  constructor(private projectService: ProjectService, private route: ActivatedRoute, private router: Router, private storageService: StorageService, private userService: UserService, private mapsService: MapsService, ) { }

  ngOnInit(): void {
    this.projectId = this.route.snapshot.paramMap.get('id');
    this.projectService.getProject(this.projectId).subscribe(data => {     
      this.project = data;
      this.mapsService.requestGeocoding(this.project.adress, this.project.city).subscribe(data => {
        let properData = JSON.parse(JSON.stringify(data));    
        
        this.mapsService.getDpeFiche(properData.data[0].latitude, properData.data[0].longitude).subscribe(data => {
          data.results.forEach(item => {
            this.etiquette = item;
          })
        });

        this.mapsService.getDvfFiche(properData.data[0].number, properData.data[0].street, properData.data[0].locality, this.project.type).subscribe(data => {
          this.dvf = data;
        });
      })
    });

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
      next: data => console.log(data),
      error: err => console.log(err),
      complete: () => console.log('GG')   
    })
  }
}
