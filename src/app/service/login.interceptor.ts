import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LoginInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) { }

  intercept(req:any,next:any) {
    let tokenizedReq=req.clone({
      setHeaders:{
        Authorization:`bearer ${this.cookieService.get('fhjsadhgvsd132vbjf@njnfe')}`
      }
    })

    return next.handle(tokenizedReq)
  }
}
