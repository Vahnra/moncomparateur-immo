import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const PROJECT_API = 'https://orn-chanarong.fr/api/project/comment';
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
export class CommentsService {

  constructor(private http: HttpClient) { }

  // add project
  addComment(
    title: String,
    text: String,
    projectId: number
    ): Observable<any> {
    return this.http.post(
      PROJECT_API + `/add${projectId}`,
      {
        title,
        text,
      },
      httpOptions
    )
  }
}
