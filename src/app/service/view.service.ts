import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ViewService {

  apiUrl=environment.host

  constructor(private http:HttpClient) { }

  getSearchProduct():Observable<any>{
    return this.http.get(`${this.apiUrl}/getfilter/product`)
  }

  getfilterProduct(data):Observable<any>{
    return this.http.post(`${this.apiUrl}/getfilter/product`,data)
  }

  getProduct():Observable<any>{
    return this.http.get(`${this.apiUrl}/getall/product`)
  }

  addProductToCart(data):Observable<any>{
    return this.http.post(`${this.apiUrl}/add/cart`,data)
  }

  addorderProduct(data):Observable<any>{
    return this.http.post(`${this.apiUrl}/add/orderProduct`,data)
  }

  updateProduct(id:any,data:any):Observable<any>{
    return this.http.put(`${this.apiUrl}/update/orderproduct/${id}`,data)
  }
  
}
