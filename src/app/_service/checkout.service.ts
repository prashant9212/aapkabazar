import { Injectable } from '@angular/core';
import { LocationService } from 'src/app/_service/location.service';
import { BagService } from 'src/app/_service/bag.service';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  bagPriceDataSubject:any;
  promocodeDataSubject:any;
  bagList:any=[];
  bagPrice:any={};
  offer:any={};
  order:any={};
  isShowSpinner:boolean = false

  constructor(
    private _LS:LocationService,
    private _BS:BagService,
    private http:HttpClient
  ) {
    this.bagPriceDataSubject = new BehaviorSubject(this.bagPrice);
    this.promocodeDataSubject = new BehaviorSubject(this.offer);
    this.bagList = this._BS.getBagList;
  }

  calculateBagPrice(){
    this.isShowSpinner = true
    let products = this.bagList.map(_=>{
      return {
        "productId":_._id,
        "quantity":_.itemQuantity
      }
    })
    let priceData = {
      "products":products,
      "locationId":this._LS.city.id,
      "offerId": this.offer._id,
      "areaId":this._LS.city.serveAreaId ? this._LS.city.serveAreaId : ""
    }
    let responseData
    this.priceDetails(priceData).subscribe(data=>{
      this.isShowSpinner = false
      responseData= data;
      this.bagPrice = responseData.cartResult;
      this.bagPriceDataSubject.next(this.bagPrice);
    },(err)=>{
      this.isShowSpinner = false
    })
  }

  set setPromocode(promocode){
    this.offer = promocode;
    this.order.offerId = this.offer._id;
    this.promocodeDataSubject.next(this.offer);
    this.calculateBagPrice();
  }

  set address(address){
    this.order.address= address;
    this.order.cityId = this._LS.city.id;
    this.order.areaId = this._LS.city.serveAreaId ? this._LS.city.serveAreaId : ""
  }

  set day(day){
    this.order.deliveryDate = day;
  }

  set time(time){
    this.order.deliveryTime = time;
  }

  set orderProduct(products){
    this.order.orderProduct = products;
  }

  get orderData(){
    return this.order;
  }

  resetOrder(){
    this.order = {};
    this.offer = {};
    this.promocodeDataSubject.next(this.offer);
  }

  priceDetails(data:any){
    return this.http.post(environment.apiUrl+'cart/calculatePrice',data);
  }

  setDefaultAddress(addressId){    
    return this.http.post(environment.apiUrl + 'address/default',{addressId:addressId});
  }

  checkOutOfStock(data:any){
    return this.http.post(environment.apiUrl+'check/cart/products',data);
  }

}
