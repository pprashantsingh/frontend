import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  apiUrl=environment.host;

  cartcount = new Subject<any>();

  constructor(private http:HttpClient) { }

  UserCartData():Observable<any>{
    return this.http.get(`${this.apiUrl}/userCartData`);
  }

  removeCartData(data):Observable<any>{
    return this.http.post(`${this.apiUrl}/deleteCartData`,data);
  }

}
