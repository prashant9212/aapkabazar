import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  walletDataSubject:any
  balance:any=0;

  constructor(private http:HttpClient) {
    this.walletDataSubject = new BehaviorSubject(this.balance);
  }

  getWalletBalance() {
    return this.http.get(environment.apiUrl + 'wallet');
  }

  getTransaction(filter){
    return this.http.get(environment.apiUrl + `transaction`,{params:filter});
  }

  getTransactionDetail(id){
    return this.http.get(environment.apiUrl + 'transaction/'+id);
  }

  cancelTransaction(transactionId){
    return this.http.post(environment.apiUrl + 'cancel/payment',{transactionId:transactionId});
  }

  addMoney(obj) {
    return this.http.post(environment.apiUrl + 'addMoney', obj);
  }

  // capturedRazorpayTransaction(paymentId) {
  //   return this.http.post(environment.apiUrl + 'razorpay/payment/captured', paymentId);
  // }

  // generateChecksumPaytm(paytmData: any) {
  //   return this.http.post(environment.apiUrl + 'generatechecksum', paytmData);
  // }

  getPromocode(params){
    return this.http.get(environment.apiUrl + 'promocode',{params:params});
  }

  applyPromocode(promoCode,cityId){
    return this.http.post(environment.apiUrl + `promocode?cityId=${cityId}`,promoCode);
  }

  createTempOrder(orderData){
    return this.http.post(environment.apiUrl+'tempOrder',orderData)
  }
  set walletBalance(balance){
    this.balance = balance
    this.walletDataSubject.next(this.balance);
  }
  // getCod(cityId){
  //   return this.http.get(environment.apiUrl+`cod/${cityId}`)
  // }
  getCod(cityId,areaId){
    return this.http.get(environment.apiUrl+`codCheck/${cityId}/${areaId}`)
  }
}
