import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const PAYMENT_API = 'https://orn-chanarong.fr/api/payment';
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
export class PaymentService {

  constructor(private http: HttpClient) { }

  // add payment
  addPayment(option: any, type: any) {
    return this.http.post(
      PAYMENT_API, {
        option,
        type
      }, httpOptions
    )
  }

  cancelSubscription() {
    return this.http.post(
      PAYMENT_API + '/cancel-subscription', {

      }, httpOptions
    )
  }
}
