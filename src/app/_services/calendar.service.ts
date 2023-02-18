import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

const CALENDAR_API = 'https://orn-chanarong.fr/api/calendar';
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
export class CalendarService {

  constructor(private http: HttpClient) { }

  addCalendarEvent(title: string, start: Date) {
    return this.http.post(
      CALENDAR_API, 
      {
        title,
        start
      }, httpOptions
    )
  }

  getAllCalendarEvents() {
    return this.http.get<CalendarEvent[]>(
      CALENDAR_API, httpOptions
    )
  }
}
