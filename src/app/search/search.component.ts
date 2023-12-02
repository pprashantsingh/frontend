import { Component, OnInit } from '@angular/core';
import { ViewService } from '../service/view.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginService } from '../service/login.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private ViewService: ViewService, private router: Router, private spinner: NgxSpinnerService,private snackbar: MatSnackBar, private loginService:LoginService) { }
  currentDate
  ngOnInit(): void {
    this.getSearchProduct();
    this.currentDate = Date.now() + 7 * 24 * 60 * 60 * 1000;
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

  productArr
  getSearchProduct() {
    this.ViewService.getSearchProduct().subscribe((res) => {
      if(res.error==false) {
        this.productArr=res.searchData[0][0];
      }
    });
  }

  detailObj = {}
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

  addProductToCart(productId) {
    let obj = {}
    obj['productId'] = productId
    this.ViewService.addProductToCart(obj).subscribe((res) => {
      if (res.error == false) {
        this.router.navigate(['/navbar'])
        setTimeout(() => {
          this.router.navigate(['/search'])
        }, 0)
        this.snackbar.open('Item added to cart', 'Okay', {
          duration: 4000
        });
      } else if (res.msg == 'You are not logged in') {
        this.snackbar.open(res.msg, 'Okay', {
          duration: 4000
        });
      } else if (res.msg == "This item is already added to cart") {
        this.snackbar.open(res.msg, 'Okay', {
          duration: 4000
        });
      }
    })
  }


  productId;
  productprice;
  originalPrice;
  getSingleData;
  productName;
  chechLoggedInBuyNow(data) {
    console.log(data)
    this.loginService.getCredential().subscribe((res) => {
      if (res.msg == 'You are not logged in') {
        this.snackbar.open(res.msg, 'Okay', {
          duration: 4000
        });
      } else {
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
    this.buyNowForm.reset()
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
          this.router.navigate(["/view"])
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
        this.getSearchProduct();
      }
    })
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

}
