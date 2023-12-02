import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ViewService } from '../service/view.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { LoginService } from '../service/login.service';
import { ProfileService } from '../service/profile.service';
import { CartService } from '../service/cart.service';
declare var $: any
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  constructor(private router: Router, private ViewService: ViewService, private cookieservice: CookieService, private snackbar: MatSnackBar, private loginService: LoginService, private ProfileService: ProfileService, private cartService: CartService) { }

  totalcartItem:any
  toggleshowhide = true

  ngOnInit(): void {
    this.cartcount()
    this.getProfileData();

    this.cartService.cartcount.subscribe((res)=>{
      console.log(res,'27')
      this.totalcartItem=res
    })
  }

  handleResponsive() {
    console.log("burgerlogo")
    document.querySelector('.handle').classList.toggle('responsive')
  }

  focusSearch() {
    (document.querySelector(".mySearch") as HTMLElement).focus();
  }

  register = new FormGroup({
    userName: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
    contactNumber: new FormControl('', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])
  })

  loginUser = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
  })

  submitted = false
  AddProfiledata() {
    this.submitted = true;
    if (this.register.valid) {
      this.ProfileService.addProfile(this.register.value).subscribe((res) => {
        if (res.error == false) {
          this.submitted = false
          this.register.reset()
          $('#register').modal('hide')
          this.snackbar.open('successfully added', 'Okay', {
            duration: 4000
          });
        }
        else if (res.msg == "This email is already exist") {
          this.snackbar.open(res.msg, 'Okay', {
            duration: 4000
          });
        } else {
          this.snackbar.open('Something Went Wrong!', 'Okay', {
            duration: 4000
          });
        }
      })
    }
  }

  userName
  getProfileData(){
    this.ProfileService.getProfileData().subscribe((res)=>{
      this.userName=res.data.userName
      
    })
  } 

  submitted2 = false
  login() {
    this.submitted2 = true;
    if (this.loginUser.valid) {
      this.loginService.loginUser(this.loginUser.value).subscribe((res) => {
        if (res.error == false && res.token) {
          this.toggleshowhide = false

          let expire = new Date();
          var time = Date.now() + 2 * 60 * 60 * 1000;
          expire.setTime(time);
          this.cookieservice.set('fhjsadhgvsd132vbjf@njnfe', res.token, expire)
          this.submitted2 = false
          this.cartcount()
          $('#login').modal('hide')
          this.loginUser.reset();
          this.getProfileData();
          this.snackbar.open('Successfully logged In', 'Okay', {
            duration: 4000
          });
        } else if (res.msg == 'you are not a registered user') {
          this.snackbar.open(res.msg, 'Okay', {
            duration: 4000
          });
        }
        else {
          this.snackbar.open('Something Went Wrong!', 'Okay', {
            duration: 4000
          });
        }
      })
    }
  }

  Logout(){
    this.toggleshowhide = true
      this.cookieservice.delete('fhjsadhgvsd132vbjf@njnfe');
      this.totalcartItem=0;
      this.userName=''
  }

  resetAll() {
    this.submitted = false
    this.register.reset()
  }

  resetAll2() {
    this.submitted2 = false
    this.loginUser.reset()
  }

  getKey(event) {
    if (event.key === "Enter") {
      let obj = new Object();
      obj['searchValue'] = (event.target.value).toLowerCase().trim()
      this.ViewService.getfilterProduct(obj).subscribe((res) => {
        if (res.error == false) {
          res.searchData[0][0].length > 0 ? this.router.navigate(['/search']) : this.snackbar.open('Soory! this Product is not available', 'Okay', {
            duration: 4000
          });
        }
      })
    }
  }

  chechLoggedInCart() {
    this.loginService.getCredential().subscribe((res) => {
      console.log(res)
      if (res.msg == 'You are not logged in') {
        this.snackbar.open(res.msg, 'Okay', {
          duration: 4000
        });
      } else {
        this.router.navigate(['/cart'])
      }
    })
  }
  chechLoggedInBuyNow() {
    this.loginService.getCredential().subscribe((res) => {
      if (res.msg == 'You are not logged in') {
        this.snackbar.open(res.msg, 'Okay', {
          duration: 4000
        });
      } else {
        this.router.navigate(['/order'])
      }
    })
  }
  chechLoggedInProfile() {
    this.loginService.getCredential().subscribe((res) => {
      if (res.msg == 'You are not logged in') {
        this.snackbar.open(res.msg, 'Okay', {
          duration: 4000
        });
      } else {
        this.router.navigate(['/profile'])
      }
    })
  }

  
  cartcount() {
    this.cartService.UserCartData().subscribe((res) => {
      if (res.totalCartItem > 0) {
        this.totalcartItem = res.totalCartItem
      } else {
        this.totalcartItem = 0
      }
    })
  }
}
