import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const PROJECT_API = 'https://orn-chanarong.fr/api/project';
const httpOptions = {
  headers: new HttpHeaders({ 
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin':'*',
    'continue': 'yes'
  })
};

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  constructor(private http: HttpClient) { }

  // add project
  addProject(
    type: String,
    city: String,
    adress: String,
    complementAdress: String,
    comments: String,
    phone_numbers: String, 
    email: String, 
    calendarTitle: String,
    calendarStart: Date,
    contact: boolean, 
    name: string,
    typeFiche: string,
    gender: string,
    trackability_info: string,
    area_size: string,
    room_numbers: string,
    floor: string,
    terrain: string,
    parking: string,
    charge: string,
    tax: string,
    origin: string
    ): Observable<any> {
    return this.http.post(
      PROJECT_API + '/add',
      {
        type,
        city,
        adress,
        complementAdress,
        comments,
        phone_numbers, 
        email, 
        calendarTitle, 
        calendarStart,
        contact,
        name,
        typeFiche,
        gender,
        trackability_info,
        area_size,
        room_numbers,
        floor,
        terrain,
        parking,
        charge,
        tax,
        origin
      },
      httpOptions
    )
  }
  

  // add project
  addProjectFromMarker(
    type: String,
    city: String,
    adress: String,
    complementAdress: String,
    ): Observable<any> {
    return this.http.post(
      PROJECT_API + '/add-from-marker',
      {
        type,
        city,
        adress,
        complementAdress
      },
      httpOptions
    )
  }

  // update project
  updateProject(
    type: String,
    city: String,
    adress: String,
    phone_numbers: String,
    status: String,
    complement_adress: string,
    name: string,
    email: String,
    projectId: number,
    contact: number,
    gender: string,
    trackability_info: string,
    area_size: string,
    room_numbers: string,
    floor: string,
    terrain: string,
    parking: string,
    charge: string,
    tax: string,
    origin: string
    ): Observable<any> {
    return this.http.put(
      PROJECT_API  + `/${projectId}`,
      {
        type,
        city,
        adress,
        phone_numbers,
        status,      
        complement_adress,
        name,
        email,
        contact,
        gender,
        trackability_info,
        area_size,
        room_numbers,
        floor,
        terrain,
        parking,
        charge,
        tax,
        origin
      },
      httpOptions
    )
  }

  // delete project
  deleteProject(projectId: number) {
    return this.http.delete(
      PROJECT_API  + `/${projectId}`, httpOptions
    )
  }

  // get all user projects
  getUserProjects(): Observable<any> {
    return this.http.get(
      PROJECT_API + '/user-projects', httpOptions
    );
  }

  // get all user projects filtered
  getUserProjectsFiltered(filter: any, date: any): Observable<any> {
    return this.http.get(
      PROJECT_API + `/user-projects/filtered?filter=${filter}&date=${date}`, httpOptions
    );
  }

  // get one user project
  getProject(projectId: any): Observable<any> {
    return this.http.get(
      PROJECT_API + `/${projectId}`, httpOptions
    );
  }

  updateProjectStatus(status: string, projectId: any) {
    return this.http.put(
      PROJECT_API + `/status/${projectId}`, 
      {
        status: status
      },
      httpOptions
    )
  }
}
