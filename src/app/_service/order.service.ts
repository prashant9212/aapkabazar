import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(private http: HttpClient) { }

  createNewOrder(orderObj: any) {
    return this.http.post(environment.apiUrl + 'newOrder', orderObj);
  }

  createCodOrder(orderObj:any){
    return this.http.post(environment.apiUrl+'newOrder/cod',orderObj)
  }

  checkOrderStatus(tempOrderId) {
    return this.http.get(environment.apiUrl + `tempOrder/${tempOrderId}`);
  }

  getOrders(filter) {
    return this.http.get(environment.apiUrl + `orders`,{params:filter});
  }

  getOrderDetails(id: any) {
    return this.http.get(environment.apiUrl + `order?orderId=${id}`);
  }

  cancelOrder(order: any) {
    return this.http.post(environment.apiUrl + 'order/cancel', order);
  }

}
