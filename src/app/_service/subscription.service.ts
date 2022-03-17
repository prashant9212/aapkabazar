import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Subscription } from 'rxjs';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  userDataSubscription:Subscription
  subscribeProduct:any={};
  minSubscriptionPrice:any=1000;
  subscriptionAddress:any={};
  subscriptionAddressDataSubject:any;
  morningBuyDataSubject:any;
  subcriptionsBagDataSubject:any;
  morningBuy:any={};
  morningBuyList:any=[];
  subcriptionsBag:any={};

  constructor(
    private http:HttpClient,  
    private _US:UserService
  ) { 
    this.subscriptionAddressDataSubject = new BehaviorSubject(this.subscriptionAddress);
    this.morningBuyDataSubject = new BehaviorSubject(this.morningBuy);
    this.subcriptionsBagDataSubject = new BehaviorSubject(this.subcriptionsBag);
    this.userDataSubscription = this._US.userDataSubject.subscribe(user=>{
      if(user._id){  
        this.reloadMorningBag();
        this.reloadSubscription();
        this.updateSubscriptionAddress();
      }
    })
  }

  reloadMorningBag(){
    this.getMorningbBuy().subscribe((data:any)=>{
      this.morningBuyList = data.morningBuys ? data.morningBuys:[];
      this.morningBuy={}
      this.morningBuyList.map((_)=>{
        this.morningBuy[_.productId] = _.quantity;
      })
      this.morningBuyDataSubject.next(this.morningBuy);
    })
  }

  reloadSubscription(){
    this.getSubscriptions().subscribe((data:any)=>{
      let subcriptionList = data.subscriptions ? data.subscriptions:[];
      this.subcriptionsBag={}
      subcriptionList.map((_)=>{
        this.subcriptionsBag[_.productId] = _.quantity;
      })
      this.subcriptionsBagDataSubject.next(this.subcriptionsBag);
    })
  }

  set product(product){
    this.subscribeProduct = product;
  }

  get product(){
    return this.subscribeProduct;
  }

  getSubscriptions() {
    return this.http.get(environment.apiUrl + 'subscription/v2');
  }

  getStatus() {
    return this.http.get(environment.apiUrl + 'subscription/v2/notification');
  }

  getSubscriptionDetail(id: any, cityId: any) {
    return this.http.get(environment.apiUrl + `subscription?subscriptionId=${id}&cityId=${cityId}`);
  }

  createSubscription(subscriptionDetail: any) {
    return this.http.post(environment.apiUrl + 'subscription/v2', subscriptionDetail);
  }

  getMorningbBuy() {
    return this.http.get(environment.apiUrl + 'subscription/v2/morningbuy');
  }
  
  createMorningbBuy(product: any) {
    return this.http.post(environment.apiUrl + 'subscription/v2/morningbuy', product);
  }

  updateMorningbBuy(product: any) {
    return this.http.put(environment.apiUrl + 'subscription/v2/morningbuy', product);
  }

  updateSubscription(subscriptionDetail) {
    return this.http.put(environment.apiUrl + 'subscription/v2', subscriptionDetail);
  }

  createAddress(address){
    return this.http.post(environment.apiUrl + 'subscription/v2/address', address);
  }

  getAddress(){
    return this.http.get(environment.apiUrl + 'subscription/v2/address');
  }

  updateSubscriptionAddress(){
    this.getAddress().subscribe((data:any)=>{
      if (data.success) {
        this.address = data.subscriptionAddress;
      } else {
        this.address = {};
      }   
    })
  }

  set address(address){
    this.subscriptionAddress = address;
    this.subscriptionAddressDataSubject.next(this.subscriptionAddress);
  }

  get address(){
    return this.subscriptionAddress;
  }

  get minWalletAmtSubs(){
    return this.minSubscriptionPrice;
  }

  resetSubscription(){
    this.morningBuy = {};
    this.morningBuyDataSubject.next(this.morningBuy);
    this.subcriptionsBag = {};
    this.subcriptionsBagDataSubject.next(this.subcriptionsBag);
    this.address = {};
  }

}
