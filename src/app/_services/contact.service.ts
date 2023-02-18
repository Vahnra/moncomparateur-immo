import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Contact } from '../models/contact';

const CONTACT_API = 'https://orn-chanarong.fr/api/contact';
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
export class ContactService {

  constructor(private http: HttpClient) { }

  addContact(name: string, adress: string, phone: string) {
    return this.http.post(
      CONTACT_API,
      {
        name,
        adress,
        phone
      }, httpOptions
    )
  }

  getUserContacts() {
    return this.http.get<Contact[]>(
      CONTACT_API, httpOptions
    )
  }
}
