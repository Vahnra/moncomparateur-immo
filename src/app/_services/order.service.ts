import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Order } from '../models/order';

const ORDER_API = 'https://orn-chanarong.fr/api/order';
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
export class OrderService {

  constructor(private http: HttpClient) { }

  getUserOrders(): Observable<any> {
    return this.http.get<Order[]>(
      ORDER_API + '/user', 
      httpOptions
    )
  }

  getUserLastOrder(): Observable<any> {
    return this.http.get<Order[]>(
      ORDER_API + '/user-last-order', 
      httpOptions
    )
  }

  getUserSpecificOrder(receiptId: string|number|null): Observable<any> {
    return this.http.get<Order[]>(
      ORDER_API + `/user-specific-order/${receiptId}`, 
      httpOptions
    )
  }

  getAllOrders() {

  }
}
