import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  apiUrl=environment.host

  constructor(private http:HttpClient) { }

  getOrderProduct():Observable<any>{
    return this.http.get(`${this.apiUrl}/get/orderDetail`)
  }

}
