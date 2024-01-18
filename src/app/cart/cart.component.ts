import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CartService } from '../service/cart.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../service/login.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ViewService } from '../service/view.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  constructor(private cartService:CartService,private ViewService:ViewService,private spinner: NgxSpinnerService,private router:Router,private loginService:LoginService,private snackbar: MatSnackBar ) { }
  currentDate
  productArr

  ngOnInit(): void {
    this.currentDate = Date.now() + 7 * 24 * 60 * 60 * 1000;
    this.cartService.UserCartData().subscribe((res)=>{
      this.productArr = res.data
    })
  }

  
  buyNowForm = new FormGroup({
    name: new FormControl("", Validators.required),
    contact: new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]),
    houseNO: new FormControl("", Validators.required),
    street: new FormControl("", Validators.required),
    pincode: new FormControl("", [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{6}$")]),
    city: new FormControl(""),
    state: new FormControl(""),
    mode: new FormControl(""),
    productId: new FormControl(""),
    QtyofProduct: new FormControl("")
  })

  detailObj
  getdetail(item) {
    this.detailObj = {}
    for (let data in item) {
      if (item[data] == '' || data == '_id' || data == 'imgUrl' || data == 'productImage') {
        continue;
      } else {
        this.detailObj[data] = item[data]
      }
    }
  }

  wow = {}
  orderProduct() {
    if (this.buyNowForm.valid) {
      this.spinner.show();
      this.buyNowForm.value.productId = this.productId
      this.buyNowForm.value.orderDate =this.orderDate
      this.buyNowForm.value.totalProductPrice = this.productprice 
      this.buyNowForm.value.deliveryDate =this.currentDate
      this.buyNowForm.value.productName =this.productName
      this.buyNowForm.value.QtyofProduct =this.quantity 
      console.log(this.buyNowForm.value)
      this.ViewService.addorderProduct(this.buyNowForm.value).subscribe((res) => {
        if (res.error == false) {
          this.updateProduct()
          this.handleBuyNow = true;
          this.basicDetail = false;
          this.paymentMOde = false;
          this.DoPayment = false;
          this.toggleOrderButton_1 = false
          this.toggleOrderButton_2 = false
          this.buyNowForm.reset()
          this.spinner.hide();
          this.snackbar.open('successfully ordered', 'Okay', {
            duration: 4000
          });
          this.quantity = 1
        } else {
          this.snackbar.open('Something Went Wrong!', 'Okay', {
            duration: 4000
          });
        }
      })
    }
  }

  updateProduct() {
    let obj = {
      NumberOfProduct: this.quantity
    }
    console.log(obj)
    this.ViewService.updateProduct(this.productId, obj).subscribe((res) => {
      if (res.error == false) {
        this.cartService.UserCartData().subscribe((res)=>{
          this.productArr = res.data
        })
      }
    })
  }

  removeProduct(productid){
    let obj = {
      productid:productid
    }

    Swal.fire({
      title: 'Are you sure?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {

        this.cartService.removeCartData(obj).subscribe(res =>{
          if(res.error==false){
            this.cartService.UserCartData().subscribe((res)=>{
              this.productArr = res.data
              this.cartcount()
              })
          }
        })

        Swal.fire(
          'Deleted!',
          'Your file has been deleted.',
          'success'
        )
      }
    })
  }

  productId;
  productprice;
  originalPrice;
  getSingleData;
  productName;
  chechLoggedInBuyNow(data) {
    this.loginService.getCredential().subscribe((res) => {
      if (res.msg == 'You are not logged in') {
        this.snackbar.open(res.msg, 'Okay', {
          duration: 4000
        });
      } else {
        // this.router.navigate(['/view'], { state: { data: data } });
        this.getSingleData = data
        this.productId = data._id
        this.productName = data.productName
        console.log(this.productId)
        this.originalPrice = this.getSingleData.productPrice
        this.productprice = this.getSingleData.productPrice
        console.log(this.getSingleData)

        this.handleBuyNow = false;
        this.basicDetail = true;
        this.paymentMOde = false;
        this.DoPayment = false;
      }
    })
  }
  goViewPage() {
    this.handleBuyNow = true;
    this.basicDetail = false;
    this.paymentMOde = false;
    this.DoPayment = false;
  }

  quantity = 1
  increase(val) {
    // console.log(val)

    if (val > this.quantity) {
      this.quantity = this.quantity + 1
      this.productprice = this.productprice + this.originalPrice
    } else {
      this.snackbar.open("Out of Stock", 'Okay', {
        duration: 4000
      });
    }
  }

  decrease() {
    if (this.quantity > 1) {
      this.quantity = this.quantity - 1
      this.productprice = this.productprice - this.originalPrice
    }
  }

  handleBuyNow = true;
  basicDetail = false;
  paymentMOde = false
  DoPayment = false;
  next(next) {
    if (next == '1' && this.buyNowForm.valid) {
      this.handleBuyNow = false;
      this.basicDetail = false;
      this.paymentMOde = true;
      this.DoPayment = false;
    }
    else if (next == '2') {
      this.handleBuyNow = false;
      this.basicDetail = false;
      this.paymentMOde = false;
      this.DoPayment = true;
    }
  }
  Privious(mode) {
    if (mode == '1') {
      this.handleBuyNow = false;
      this.basicDetail = true;
      this.paymentMOde = false;
      this.DoPayment = false;

      this.toggleOrderButton_1 = false
      this.toggleOrderButton_2 = false
    } else {
      this.handleBuyNow = false;
      this.basicDetail = false;
      this.paymentMOde = true;
      this.DoPayment = false;

      this.toggleOrderButton_1 = false
      this.toggleOrderButton_2 = false
    }

  }

  modeObj = {}
  toggleOrderButton_1 = false;
  toggleOrderButton_2 = false;
  getValue(val, mode) {
    if (val == '1') {
      this.buyNowForm.value.mode = mode
      this.toggleOrderButton_1 = true
      this.toggleOrderButton_2 = false
      console.log(this.buyNowForm.value)
    } else if (val == '2') {
      this.buyNowForm.value.mode = mode
      this.toggleOrderButton_1 = false
      this.toggleOrderButton_2 = true
    }
  }

  //list of pincode

  arrOfPinCode = [
    { pincode: 226016, city: 'Lucknow', state: 'Uttar Pradesh', day: 2 },
    { pincode: 226010, city: 'Lucknow', state: 'Uttar Pradesh', day: 3 },
    { pincode: 226025, city: 'Lucknow', state: 'Uttar Pradesh', day: 5 },
    { pincode: 226020, city: 'Lucknow', state: 'Uttar Pradesh', day: 6 },
    { pincode: 226031, city: 'Lucknow', state: 'Uttar Pradesh', day: 4 },
    { pincode: 221008, city: 'Varanasi', state: 'Uttar Pradesh', day: 7 },
    { pincode: 221005, city: 'Varanasi', state: 'Uttar Pradesh', day: 6 },
    { pincode: 221010, city: 'Varanasi', state: 'Uttar Pradesh', day: 5 },
    { pincode: 221002, city: 'Varanasi', state: 'Uttar Pradesh', day: 3 },
  ]
  orderDate
  checkPincode(val) {
      for (let item of this.arrOfPinCode) {
        if (item.pincode == val) {
          this.buyNowForm.value.city = item.city
          this.buyNowForm.value.state = item.state
          this.currentDate = Date.now();
          this.orderDate = Date.now();
          this.currentDate = this.currentDate + item.day * 24 * 60 * 60 * 1000;
        }
      }
  }

  totalcartItem
  cartcount() {
    this.cartService.UserCartData().subscribe((res) => {
      console.log(res)
      if (res.totalCartItem > 0) {
        this.totalcartItem = res.totalCartItem
        this.cartService.cartcount.next(this.totalcartItem)
      } else {
        this.totalcartItem = 0
        this.cartService.cartcount.next(this.totalcartItem)
      }
    })
  }

}
