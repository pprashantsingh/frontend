import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  apiUrl=environment.host

  constructor(private http:HttpClient) { }

  addProfile(data):Observable<any>{
    return this.http.post(`${this.apiUrl}/add/profile`,data)
  }
  getProfileData():Observable<any>{
    return this.http.get(`${this.apiUrl}/add/getprofile`)
  }
}
