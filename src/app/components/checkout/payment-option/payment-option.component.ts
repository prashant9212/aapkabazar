import { Component, OnInit } from '@angular/core';
import { PaymentService, WindowRefService, UserService, CheckoutService, LocationService, } from 'src/app/_service';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import * as url from 'url';
import { v4 as uuidv4 } from 'uuid';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-option',
  templateUrl: './payment-option.component.html',
  styleUrls: ['./payment-option.component.scss']
})
export class PaymentOptionComponent implements OnInit {
  userDataSubscription: Subscription;
  promocodeDataSubscription: Subscription;
  transactionId: any;
  paymentModeForm: any;
  addAmount: any = 0;
  returnUrl: any;
  user: any = {};
  token: any;
  offer: any;
  minWalletAmount: any = environment.minWalletAmount;
  options: any = {
    key_id: environment.rzpKey,
    amount: 0,
    name: environment.razorPayValues.name,
    description: environment.razorPayValues.description,
    image: environment.razorPayValues.image,
    order_id: '',
    prefill: {},
    theme: {
      color: '#1f76bb'
    }
  };
  walletSubscription: Subscription;
  bagPriceDataSubscription: Subscription;
  isWallet: boolean = false;
  isOrder: boolean = false;
  balance: any = 0;
  isWalletPayment: boolean = false;
  bagPrice: any = {};
  payableAmount: any = 0;
  tempOrderData: any = {};
  isCod:boolean=false

  constructor(
    private _PS: PaymentService,
    private _WS: WindowRefService,
    private _US: UserService,
    private _CS: CheckoutService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private _TS: ToastrService,
    private _LS:LocationService
  ) {
    this.paymentModeForm = new FormGroup({
      mode: new FormControl(''),
    });
  }

  ngOnInit(): void {
    this.getCod()
    this.tempOrderData = JSON.parse(localStorage.getItem('order'))
    this.token = this._US.userToken;
    this.userDataSubscription = this._US.userDataSubject.subscribe(data => {
      this.user = data;
    })
    this.promocodeDataSubscription = this._CS.promocodeDataSubject.subscribe(data => {
      this.offer = data;
    })
    this.walletSubscription = this._PS.walletDataSubject.subscribe(balance => {
      this.balance = balance;
      this.isWalletPayment = this.balance > 0;
    })
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params.returnUrl;
      this.isOrder = params.isOrder == "true" ? true : false;
      this.isWallet = params.isWallet == "true" ? true : false;
      if (this.isOrder && !this.isWallet) {
        this.bagPrice = this._CS.bagPrice;
        this.payableAmount = this.bagPrice.payableAmount
        if (this.balance < this.payableAmount) {
          this.addAmount = this.payableAmount - this.balance;
          this.paymentModeForm.controls["mode"].setValue("paytm");
        } else {
          this.addAmount = this.payableAmount;
        }
      } else if (this.isWallet && !this.isOrder) {
        this.addAmount = params.addAmount;
        this.paymentModeForm.controls["mode"].setValue("paytm");
      } else {
        this.router.navigate(['/']);
      }
    })
    this.paymentModeForm.get("mode").valueChanges.subscribe(mode => {
      if (this.balance >= this.payableAmount && mode != "") {
        if (this.isWalletPayment) {
          this.isWalletPayment = !this.isWalletPayment
        }
      }
    })
  }

  // getCod(){
  //  let cityId=this._LS.city.id ? this._LS.city.id : ""
  //   this._PS.getCod(cityId).subscribe((res:any)=>{
  //     if(res.success){
  //       this.isCod= res.data.isCodOrder
  //     }
  //   },(err)=>{
  //     this._TS.error(err.message)
  //   })
  // }
  getCod(){
    let cityId=this._LS.city.id ? this._LS.city.id : ""
    let areaId=this._LS.city.serveAreaId ? this._LS.city.serveAreaId : "";
    this._PS.getCod(cityId,areaId).subscribe((res:any)=>{
      if(res.success){
        this.isCod= res.data.isCodOrder
      }
    },(err)=>{
      this._TS.error(err.message)
    })
  }

  checkMBWallet() {
    this.isWalletPayment = !this.isWalletPayment
    if (this.balance < this.payableAmount) {
      if (this.isWalletPayment) {
        this.addAmount = this.payableAmount - this.balance;
      } else {
        this.addAmount = this.payableAmount;
      }
    } else if (this.balance >= this.payableAmount) {
      this.addAmount = this.payableAmount;
      this.paymentModeForm.controls["mode"].setValue("");
    }
  }

  payNow(mode) {
    if (mode == "mbwallet") {
      this.router.navigate(['/order/status']);
    } else if (mode === "paytm") {
      this.createTempOrder()
    } else if (mode === "card") {
      this.options.prefill['method'] = 'card';
      this.createTempOrder();
    } else if (mode === "netbanking") {
      this.options.prefill['method'] = 'netbanking';
      this.createTempOrder()
    } else if (mode === "otherWallet") {
      this.options.prefill['method'] = 'wallet';
      this.createTempOrder()
    } else if (mode === "upi") {
      this.options.prefill['method'] = 'upi';
      this.createTempOrder()
    }
    else if (mode === "cod") {
      localStorage.setItem('paymentMode','cod')
      this.router.navigate(['/order/status']);
    }
  }

  changeMbWalletPayment(){
    this.isWalletPayment=false
    this.addAmount=this.payableAmount
  }

  createTempOrder() {
    if (this.isOrder && !this.isWallet) {
      this._PS.createTempOrder(this.tempOrderData).subscribe((res: any) => {
        if (res.success) {
          if (this.paymentModeForm.value['mode'] == "paytm") {
            this.generatePaytmChecksum(res.tempOrderId);
          }
          else {
            this.addMoneyViaRazorpay(res.tempOrderId)
          }
        }
        else {
          this._TS.warning(res.message)
        }
      }, (error) => {
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
      })
    } else if (!this.isOrder && this.isWallet) {
      if (this.paymentModeForm.value['mode'] == "paytm") {
        this.generatePaytmChecksum('');
      }
      else {
        this.addMoneyViaRazorpay('')
      }
    }

  }

  generatePaytmChecksum(tempOrderId) {
    let orderId = uuidv4();
    let payTmConfig: any = {};
    payTmConfig = environment.payTmConfig;
    payTmConfig.ORDER_ID = orderId.toString();
    payTmConfig.CUST_ID = this.user._id;
    payTmConfig.TXN_AMOUNT = this.addAmount.toString();
    payTmConfig.EMAIL = this.user.email ? this.user.email : '';
    payTmConfig.MOBILE_NO = this.user.phoneNo ? this.user.phoneNo.toString() : '';
    payTmConfig.paymentGateway = "paytm";
    payTmConfig.tempOrderId = tempOrderId,
      payTmConfig.CALLBACK_URL = url.format({
        pathname: environment.apiUrl + "addMoney/paytm",
        query: {
          token: this.token.slice(1, -1),
          currentUrl: this.returnUrl,
          isWallet: this.isWallet,
          isOrder: this.isOrder,
          promoName: this.offer._id ? this.offer.promocode : '',
          isPromocodeApplied: this.offer._id ? true : false,
          isWebsite: true
        }
      });
    if (this.isWallet) {
      delete payTmConfig['tempOrderId']
    }
    let responseData;
    this._PS.addMoney(payTmConfig).subscribe(data => {
      responseData = data;
      if (responseData.success) {
        this.transactionId = responseData.transactionId
        this.createPaytmForm(responseData);
      } else {
        console.log(responseData.message);
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)

    })
  }

  createPaytmForm(responsePaytm) {

    let paytmData = responsePaytm.paytmResponse;
    paytmData['CHECKSUMHASH'] = responsePaytm.checksumHash;
    paytmData.ENVIRONMENT = environment.paytmEnv;

    const my_form: any = document.createElement('form');
    my_form.name = 'paytm_form';
    my_form.method = 'post';
    my_form.action = environment.paytmAction;

    const myParams = Object.keys(paytmData);
    for (let i = 0; i < myParams.length; i++) {
      const key = myParams[i];
      let my_tb: any = document.createElement('input');
      my_tb.type = 'hidden';
      my_tb.name = key;
      my_tb.value = paytmData[key];
      my_form.appendChild(my_tb);
    };

    document.body.appendChild(my_form);
    my_form.submit();
  }

  addMoneyViaRazorpay(temporderId) {
    const razorpayOrder = {
      amount: this.addAmount,
      currency: 'INR',
      paymentGateway: "razorpay",
      tempOrderId: temporderId
    };
    if (this.isWallet) {
      delete razorpayOrder['tempOrderId']
    }
    this.createRazorpayOrder(razorpayOrder);
  }

  createRazorpayOrder(razorpayOrder) {
    let razorpayOrderResponse;
    this.options.prefill.email = this.user.email ? this.user.email : '';
    this.options.prefill.contact = this.user.phoneNo ? this.user.phoneNo : '';
    this._PS.addMoney(razorpayOrder).subscribe(data => {
      razorpayOrderResponse = data;
      if (razorpayOrderResponse.success) {
        this.transactionId = razorpayOrderResponse.transactionId
        this.initiatePayment(razorpayOrderResponse.razorOrderRes);
      } else {
        console.log(razorpayOrderResponse.message);
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  initiatePayment(razorpayOrderResponse) {
    this.options.amount = razorpayOrderResponse.amount;
    this.options.order_id = razorpayOrderResponse.id;
    const my_form: any = document.createElement('form');
    my_form.method = 'post';
    my_form.action = 'https://api.razorpay.com/v1/checkout/embedded';
    this.options.callback_url = url.format({
      pathname: environment.apiUrl + "callback/razorpay",
      query: {
        token: this.token.slice(1, -1),
        currentUrl: this.returnUrl,
        isWallet: this.isWallet,
        isOrder: this.isOrder,
        promoName: this.offer._id ? this.offer.promocode : '',
        isPromocodeApplied: this.offer._id ? true : false,
        isWebsite: true,
        paymentGateway: "razorpay"
      }
    })
    this.options.cancel_url = url.format({
      pathname: environment.apiUrl + "callback/razorpay/cancel",
      query: {
        token: this.token.slice(1, -1),
        currentUrl: this.returnUrl,
        isWallet: this.isWallet,
        isOrder: this.isOrder,
        promoName: this.offer._id ? this.offer.promocode : '',
        isPromocodeApplied: this.offer._id ? true : false,
        isWebsite: true,
        orderId: this.options.order_id
      }
    })
    let keys = ["key_id", "order_id", "name", "callback_url", "cancel_url"];
    for (let i = 0; i < keys.length; i++) {
      let my_tb: any = document.createElement('input');
      my_tb.type = 'hidden';
      my_tb.name = keys[i];
      my_tb.value = this.options[keys[i]];
      my_form.appendChild(my_tb);
    }
    let my_tb = document.createElement('input');
    my_tb.type = 'hidden';
    my_tb.name = "prefill[contact]";
    my_tb.value = this.options.prefill["contact"];
    my_form.appendChild(my_tb);
    my_tb = document.createElement('input');
    my_tb.type = 'hidden';
    my_tb.name = "prefill[email]";
    my_tb.value = this.options.prefill["email"];
    my_form.appendChild(my_tb);
    my_tb = document.createElement('input');
    my_tb.type = 'hidden';
    my_tb.name = "prefill[method]";
    my_tb.value = this.options.prefill["method"];
    my_form.appendChild(my_tb);
    document.body.appendChild(my_form);
    my_form.submit();
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
}
