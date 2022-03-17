import { Component, OnInit , Input } from '@angular/core';
import { BagService,SubscriptionService,PaymentService, ProductService, LocationService } from 'src/app/_service';
import { Subscription } from 'rxjs';
import { ToastrService } from "ngx-toastr";
import { Router } from '@angular/router';
import { AddAddressModalComponent } from 'src/app/components/common/add-address-modal/add-address-modal.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LoginComponent } from 'src/app/template/header/login/login.component'

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() public product :any={};
  bag:any;
  addressModalRef:BsModalRef;
  loginModalRef: BsModalRef;
  morningBuy:any={};
  subcriptionsBag:any={};
  morningBuySubscription:Subscription;
  subcriptionsBagSubscription:Subscription;
  isShowSpinner:boolean=false
  constructor(
    private _SS:SubscriptionService,
    private _BS:BagService,
    private _PS:PaymentService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    private _LS:LocationService,
    private _PRS:ProductService
  ) {
    this.morningBuySubscription = this._SS.morningBuyDataSubject.subscribe((data:any)=>{
      this.morningBuy = data;
    });
    this.subcriptionsBagSubscription = this._SS.subcriptionsBagDataSubject.subscribe((data:any)=>{
      this.subcriptionsBag = data;
    });
  }

  ngOnInit(): void {
    this.bag = this._BS.productBag;
  }

  incrementQuantity(){
    this._BS.incrementQuantity = this.product;
  }

  decrementQuantity(){
    this._BS.decrementQuantity = this.product;
  }

  newSubscription(){
    this._SS.getAddress().subscribe((response:any)=>{
      if(response.success){
        this._SS.address=response.subscriptionAddress;
        let subscriptionAddress = this._SS.address;
        if(!subscriptionAddress.societyId){
          this.addNewAddressModal();
        }else {
          let subscription = subscriptionAddress;
          subscription.productId = this.product._id;
          subscription.quantity = 1;
          this.isShowSpinner=true
          this._SS.createSubscription(subscription).subscribe((data:any)=>{
            this.isShowSpinner=false
              if(data.success){
              this.toastr.success(data.message);
              this._SS.reloadSubscription();
            }else{
              this.toastr.warning(data.message);
            }
          },(error)=>{
            this.isShowSpinner=false
            this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
          })
        }
      }
    },(err)=>{
      if(err.status==403){
        this.toastr.warning(err.error.message);
        this.login();
      }
    })
  }

  login() {
    this.loginModalRef = this.modalService.show(LoginComponent, Object.assign({}, { class: 'mb-login-modal' }));
  }

  updateSubscription(productId,quantity,action){
    if(this.subcriptionsBag[productId]<this.product.perUserOrderQuantity || quantity<this.subcriptionsBag[productId]){
      let subscription:any= {};
      subscription.productId = productId;
      subscription.quantity = quantity;
      subscription.action = action;
      this._SS.updateSubscription(subscription).subscribe((data:any)=>{
        if(data.success){
          this.toastr.success(data.message);
          this._SS.reloadSubscription();
        }else{
          this.toastr.error(data.message);
        }
      },(error)=>{
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
      })
    }
    else{
      this.toastr.warning("Limited quantity available you can't add more of this item");
    }
  }

  addNewAddressModal(){
    let data ={
      initialState:{
        isSubscription:true,
        type:'add'
      }
    };
    this.addressModalRef = this.modalService.show(AddAddressModalComponent,data);
  }

  addToMorningBuy(productId){
    this._SS.getAddress().subscribe((response:any)=>{
      this._SS.address=response.subscriptionAddress? response.subscriptionAddress:{} ;
      let subscriptionAddress = this._SS.address;
      if(!subscriptionAddress.societyId){
        this.addNewAddressModal();
      }else {
        let morningBuy:any = {};
        morningBuy.productId = productId;
        morningBuy.quantity = 1;
        this.isShowSpinner=true
        this._SS.createMorningbBuy(morningBuy).subscribe((data:any)=>{
          this.isShowSpinner=false
          if(data.success){
            this.toastr.success(data.message);
            this._SS.reloadMorningBag();
          }else{
            this.toastr.warning(data.message);
          }
        },(error)=>{
          this.isShowSpinner=false
          this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
        })
      }
    },(err)=>{
      if(err.status==403){
        this.toastr.warning(err.error.message);
        this.login();
      }
    })
  }

  updateMorningBuy(productId,quantity,action){
    if( this.morningBuy[productId]<this.product.perUserOrderQuantity || quantity<this.morningBuy[productId]){
      let morningBuy:any = {};
      morningBuy.productId = productId;
      morningBuy.quantity = quantity;
      morningBuy.action = action;
      this._SS.updateMorningbBuy(morningBuy).subscribe((data:any)=>{
        if(data.success){
          this.toastr.success(data.message);
          this._SS.reloadMorningBag();
        }else{
          this.toastr.warning(data.message);
        }
      },(error)=>{
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
      })
    }
    else{
      this.toastr.warning("Limited quantity available you can't add more of this item");
    }
  }


  startdateOne:any;
  enddateOne:any;
  todayDate:any;
  checkDateTrueORFolse(startDate:any, endDate:any)
  {
     this.todayDate = new Date(); //Today Date
     this.startdateOne = new Date(startDate);
     this.enddateOne = new Date(endDate);
      if (this.todayDate > this.startdateOne) {
        if(this.todayDate < this.enddateOne){
          return true
        }else{
          return false
        }
      }else {
        return false
      }
  }



  currentDate: any;
  targetDate: any;
  cDateMillisecs: any;
  tDateMillisecs: any;
  difference: any;
  seconds: any;
  minutes: any;
  hours: any;
  days: any;
  year:number = 2021;
  month:number = 9;
  months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  day:number = 18;

  myTimer(date:any) {
    this.currentDate = new Date();
    this.targetDate = new Date(date);
    this.cDateMillisecs = this.currentDate.getTime();
    this.tDateMillisecs = this.targetDate.getTime();
    this.difference = this.tDateMillisecs - this.cDateMillisecs;
    this.seconds = Math.floor(this.difference / 1000);
    this.minutes = Math.floor(this.seconds / 60);
    this.hours = Math.floor(this.minutes / 60);
    this.days = Math.floor(this.hours / 24);

    this.hours %= 24;
    this.minutes %= 60;
    this.seconds %= 60;
    this.hours = this.hours < 10 ? "0" + this.hours : this.hours;
    this.minutes = this.minutes < 10 ? "0" + this.minutes : this.minutes;
    this.seconds = this.seconds < 10 ? "0" + this.seconds : this.seconds;


    // document.getElementById("days").innerText = this.days;
    // document.getElementById("hours").innerText = (Number(this.hours) + 6).toString();
    // document.getElementById("mins").innerText = this.minutes;
    // document.getElementById("seconds").innerText = this.seconds;

    setInterval(this.myTimer, 1000);
    return "Ends in " + this.days + " : " + this.hours + ' : ' + this.minutes + ' : ' + this.seconds + '';
  }

  getProductDetail(productId:any){
    let params = {
      productId:productId,
      cityId:this._LS.city.id
    }
    this._PRS.getProductsById(params).subscribe((res:any)=>{
      this.product = res.product ? res.product : {}
    },(err)=>{
      this.toastr.error(err.message)
    })
  }
}
