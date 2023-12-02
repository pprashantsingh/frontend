import { Component, OnInit } from '@angular/core';
import { FormGroup ,FormControl, Validators} from '@angular/forms';
import { ProfileService } from '../service/profile.service';
import swal from 'sweetalert2'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private ProfileService:ProfileService) { }

  ngOnInit(): void {
  }

  // register = new FormGroup( {
  //   userName:new FormControl(''),
  //   email: new FormControl(''),
  //   contactNumber: new FormControl('')
  // })

  // getProfiledata() {
  //   this.ProfileService.addProfile(this.register.value).subscribe((res)=> {
  //     if(res.error==false){
  //       this.register.reset()
  //       console.log("success")
  //       swal.fire('success','successfully added','success')
  //     }
  //   })
  // }
}
