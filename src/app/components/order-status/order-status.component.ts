import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PaymentService, CheckoutService, OrderService, BagService } from 'src/app/_service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-order-status',
  templateUrl: './order-status.component.html',
  styleUrls: ['./order-status.component.scss']
})
export class OrderStatusComponent implements OnInit {
  queryParams: any = {
    success : false
  };
  orderProgress:boolean=false;
  orderData:any={};
  isShowInProgress:boolean=false
  constructor(
    private _PS: PaymentService,
    private _CS: CheckoutService,
    private _OS: OrderService,
    private _BS: BagService,
    private router: Router,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {

    setTimeout(() => {
      this.router.navigateByUrl("/order");
     }, 20000);  //20s

    if (localStorage.getItem("order")) {
      this.orderProgress=true;
      if(localStorage.getItem('paymentMode') == 'cod'){
        this.placeCodOrder()
      }
      else{
        this.placeOrder();
      }
    }else{
      this.orderProgress=false;
      localStorage.removeItem('order')
      this.orderProgress=false;
      this.orderData = {
        success: false,
        message: "order not found"
      }
      setTimeout(()=>{
        this.router.navigate(['/']);
      },3000)
    }
  }

  placeOrder() {
    this.isShowInProgress=true
    let responseData;
    let order = JSON.parse(localStorage.getItem("order"));
    this._OS.createNewOrder(order).subscribe(data => {
      this.isShowInProgress=false
      this.orderProgress=false;
      responseData = data;
      if (responseData.success) {
        this.updateWalletBalance();
        this._BS.resetBag();
        this._CS.resetOrder();
        localStorage.removeItem('order')
        this.orderData.success= true,
        this.orderData.type= "order",
        this.orderData.amount= responseData.transaction.amount,
        this.orderData.mobileNo= responseData.transaction.mobileNo,
        this.orderData.transactionId= responseData.transaction.id,
        this.orderData.orderId= responseData.orderIntId,
        this.orderData._id= responseData.transaction.orderId,
        this.orderData.paymentMode= responseData.transaction.paymentMode,
        this.orderData.date= responseData.transaction.created
      }else{
        this.orderData = {
          success: false,
          message: responseData.message
        }  
      }
    }, (error) => {
      this.orderProgress=false;
      this.isShowInProgress=false
      this.orderData = {
        success: false,
        message: error.error.message
      }
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  updateWalletBalance() {
    let responseData;
    this._PS.getWalletBalance().subscribe(data => {
      responseData = data;
      this._PS.walletBalance = responseData.balance;
    },(error)=>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  placeCodOrder(){
    this.isShowInProgress=true
    let order = JSON.parse(localStorage.getItem("order"));
    this._OS.createCodOrder(order).subscribe((res:any)=>{
      this.isShowInProgress=false
      this.orderProgress=false;
      if(res.success){
        this._BS.resetBag();
        this._CS.resetOrder();
        localStorage.removeItem('order')
        localStorage.removeItem('paymentMode')
        this.orderData.success= true,
        this.orderData.type= "order"
        this.orderData.amount= res.data.amount,
        this.orderData.mobileNo= res.data.mobileNo,
        this.orderData.paymentMode= res.data.paymentMode,
        this.orderData.date= res.data.orderDate
        this.orderData.orderId= res.data.orderId
      }else{
        this.orderData = {
          success: false,
          message: res.message
        }  
      }
    },(error) => {
      this.orderProgress=false;
      this.isShowInProgress=false
      this.orderData = {
        success: false,
        message: error.error.message
      }
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }
}
