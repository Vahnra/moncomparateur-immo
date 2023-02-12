import { Injectable } from '@angular/core';

export interface ToastInfo {
  header: string;
  body: string;
  button: string;
  delay?: number;
  classname: any
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {

  constructor() { }

  toasts: ToastInfo[] = [];

  show(header: string, body: string, options: any = {}) {
    this.toasts.push({ header, body, ...options });
  }

  showFromDpe(header: string, body: string, button: string, options: any = {}) {
    this.toasts.push({ header, body, button, ...options });
  }

  remove(toast: ToastInfo) {
    this.toasts = this.toasts.filter(t => t != toast);
  }
}
