import { Component, OnInit } from '@angular/core';
import { OrderService } from '../service/order.service';
@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {

  constructor(private orderService: OrderService) { }

  ngOnInit(): void {
    this.getorderProduct()
  }

  myOrderData = [];
  getorderProduct() {
    this.myOrderData = []
    this.orderService.getOrderProduct().subscribe((res) => {
      if (res.error == false) {
        this.myOrderData.push(...res.data)
        console.log(this.myOrderData)
      }
    })
  }
}
