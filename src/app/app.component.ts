import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'frontend';

  showNevbar=true

  constructor(private router:Router){
    router.events.subscribe(
      (val)=>{
        if(val instanceof NavigationEnd){
          if(val.url=='/profile') {
            this.showNevbar=false
          }else if(val.url=='/search'){
            this.showNevbar=false
          }else if(val.url=='/navbar'){
            this.showNevbar=false
          }else{
            this.showNevbar=true
          }
        }
      }
    )
  }
  
}
