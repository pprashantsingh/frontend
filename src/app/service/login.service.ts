import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  apiUrl=environment.host;

  constructor(private http:HttpClient) { }

  loginUser(data:any):Observable<any>{
    return this.http.post(`${this.apiUrl}/loginuser`,data);
  }
  getCredential():Observable<any>{
    return this.http.get(`${this.apiUrl}/credential`);
  }
}