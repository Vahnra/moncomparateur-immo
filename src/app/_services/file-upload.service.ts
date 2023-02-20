import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const FILEUPLOAD_API = 'https://orn-chanarong.fr/api/images';
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
export class FileUploadService {

  constructor(private http: HttpClient) {}

  upload(file: File, projectId: string|number): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);
    
    const req = new HttpRequest('POST', `${FILEUPLOAD_API}/upload${projectId}`, formData, {
      reportProgress: true,
      responseType: 'json',
      headers: new HttpHeaders({ 
        'Access-Control-Allow-Origin':'*',
        'continue': 'yes'
      })
    });

    return this.http.request(req);
  }

  getFiles(projectId: any): Observable<any> {
    return this.http.get(`${FILEUPLOAD_API}/file?id=${projectId}`, httpOptions);
  }
}
