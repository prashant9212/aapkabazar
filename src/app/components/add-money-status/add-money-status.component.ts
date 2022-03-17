import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaymentService, CheckoutService, OrderService, BagService } from 'src/app/_service';
import { interval } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-add-money-status',
  templateUrl: './add-money-status.component.html',
  styleUrls: ['./add-money-status.component.scss']
})
export class AddMoneyStatusComponent implements OnInit, OnDestroy {
  paymentData: any = {};
  orderData: any = {};
  paymentProgress: boolean = true;
  subscription: any;
  message: any = "";

  constructor(
    private route: ActivatedRoute,
    private _PS: PaymentService,
    private _CS: CheckoutService,
    private _OS: OrderService,
    private _BS: BagService,
    private toastr: ToastrService
  ) { }


  ngOnInit(): void {

    // setTimeout(() => {
    //   window.location.href = "/home";
    //  }, 20000);  //20s
  }

  ngAfterViewInit() {
    this.route.queryParams.subscribe((params: any) => {
      this.paymentData.isOrder = params.isOrder == "true" ? true : false;
      this.paymentData.isWallet = params.isWallet == "true" ? true : false;
      // this.paymentData.success =params.success=="true" ? true:false;
      this.paymentData.amount = params.amount;
      this.paymentData.transactionId = params.transactionId;
      this.paymentData.paymentMode = params.paymentMode;
      let order = JSON.parse(localStorage.getItem("order"));
      let observable = interval(2000);
      this.subscription = observable.subscribe((x) => {
        this._PS.getTransactionDetail(this.paymentData.transactionId).subscribe((response: any) => {
          if (response.success && response.transaction.status == "added") {
            this.paymentData.success = true;
            this.subscription.unsubscribe();
            this.paymentProgress = false;
            console.log('1',this.paymentData);
            console.log('2',order);
            if (this.paymentData.isOrder && this.paymentData.success && order != null) {
              //this.checkOrderStatus(response.transaction.tempOrderId);
              console.log('Hello');
              
              this.placeOrder();
            } else {
              
              this.message = response.transaction.message;
              this.updateWalletBalance();
            }
          } else if (response.success && response.transaction.status == "pending") {
            this.message = response.transaction.message;
          } else if (response.success && response.transaction.status == "failed") {
            this.message = response.transaction.message;
            this.paymentData.success = false;
            this.paymentProgress = false;
            this.orderData = {
              success: false
            };
            this.subscription.unsubscribe();
          } else {

          }
        })
      });
      setTimeout(() => {
        this.subscription.unsubscribe();
        if (this.paymentProgress) {
          localStorage.removeItem('order')
        }
      }, 120 * 1000);
    })
  }

  placeOrder() {
    let responseData;
    let order = JSON.parse(localStorage.getItem("order"));
    this._OS.createNewOrder(order).subscribe(data => {
      responseData = data;
      console.log('createNewOrder',responseData);
      if (responseData.success) {
        this.updateWalletBalance();
        this.message = "Order Placed";
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
      this.orderData = {
        success: false,
        message: error.error.message
      }
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }
  

  checkOrderStatus(tempOrderId) {
    let observable = interval(2000);
    this.subscription = observable.subscribe((x) => {
      this._OS.checkOrderStatus(tempOrderId).subscribe((response: any) => {
        if (response.success) {
          console.log('3',response);
          if (response.order.status == "pending") {
            this.message = "Order Placed";
            this.subscription.unsubscribe();
            this.updateWalletBalance();
            this._BS.resetBag();
            this._CS.resetOrder();
            this.orderData.success = true;
            this.orderData.type = "order";
            this.orderData.amount = response.transaction.amount;
            this.orderData.mobileNo = response.transaction.mobileNo;
            this.orderData.transactionId = response.transaction.id;
            this.orderData.orderId = response.order.orderIntId;
            this.orderData._id = response.transaction.orderId;
            this.orderData.paymentMode = response.transaction.paymentMode;
            this.orderData.date = response.transaction.created;
          }
        }
      })
    })
    setTimeout(() => {
      this.subscription.unsubscribe();
    }, 120 * 1000);
  }
  
  updateWalletBalance() {
    let responseData;
    this._PS.getWalletBalance().subscribe(data => {
      responseData = data;
      this._PS.walletBalance = responseData.balance;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
