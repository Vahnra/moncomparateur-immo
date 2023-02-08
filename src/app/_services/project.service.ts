import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const PROJECT_API = 'http://localhost:8000/api/project';
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
    comments: String
    ): Observable<any> {
    return this.http.post(
      PROJECT_API + '/add',
      {
        type,
        city,
        adress,
        complementAdress,
        comments
      },
      httpOptions
    )
  }

  // get all user projects
  getUserProjects(): Observable<any> {
    return this.http.get(
      PROJECT_API + '/user-projects', httpOptions
    );
  }

  // get one user project
  getProject(projectId: any): Observable<any> {
    return this.http.get(
      PROJECT_API + `/${projectId}`, httpOptions
    );
  }
}
