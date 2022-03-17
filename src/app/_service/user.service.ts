import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  userDataSubject:any;
  addressDataSubject:any;
  user:any={};
  token:any=null;
  addressList:any=[];

  constructor(
    private http:HttpClient,
    private router:Router,
  ) {
    if(localStorage.getItem("user")){
      this.user = JSON.parse(localStorage.getItem("user"))
      this.token = localStorage.getItem("token")
    }
    this.userDataSubject = new BehaviorSubject(this.user);
    this.addressDataSubject = new BehaviorSubject(this.addressList);
  }

  register(userData: any) {
    return this.http.post(environment.apiUrl + 'register', userData);
  }

  otpVerify(verify: any) {
    return this.http.post(environment.apiUrl + 'otp/verify', verify);
  }
  otpLoginVerify(verify: any) {
    return this.http.post(environment.apiUrl + 'loginByOtp', verify);
  }

  forgot(verify: any) {
    return this.http.post(environment.apiUrl + 'forgot', verify);
  }

  resendOtp(verify) {
    return this.http.post(environment.apiUrl + 'otp/resend',verify);
  }

  savePassword(userData: any) {
    return this.http.post(environment.apiUrl + 'savePassword', userData);
  }

  login(userData: any) {
    return this.http.post(environment.apiUrl + 'login', userData);
  }

  changePassword(passwordmodel: any) {
    return this.http.post(environment.apiUrl + 'password/change/oldpassword', passwordmodel);
  }

  updateProfile(model: any) {
    return this.http.post(environment.apiUrl + 'profile', model);
  }

  getProfile() {
    return this.http.get(environment.apiUrl + 'profile');
  }

  addNewAddress(model: any) {
    return this.http.post(environment.apiUrl + 'address', model);
  }

  getAddress(){
    return this.http.get(environment.apiUrl + 'address');
  }

  updateAddress(address: any) {
    return this.http.put(environment.apiUrl + 'address', { address: address });
  }

  deleteAddress(addressId){
    return this.http.delete(environment.apiUrl + `address/?addressId=${addressId}`);
  }

  getInvitationData(){
    return this.http.get(environment.apiUrl+'referalcode');
  }

  getUserNetworkIp(){
    return this.http.get('http://api.ipify.org/?format=json')
  }

  setDefaultAddress(addressId){
    return this.http.post(environment.apiUrl + 'address/default',{addressId:addressId});
  }

  set address(addressList){
    this.addressList=addressList;
    this.addressDataSubject.next(this.addressList);
  }

  get userToken(){
    return this.token;
  }

  logout(){
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    this.user={};
    this.token=null;
    this.userDataSubject.next(this.user);
    this.router.navigate(['/'])
    return true;
  }

  userData(token:any,user:any){
    localStorage.setItem("user",JSON.stringify(user));
    localStorage.setItem("token",JSON.stringify(token));
    this.user = JSON.parse(localStorage.getItem("user"))
    this.token = localStorage.getItem("token")
    this.userDataSubject.next(this.user);
    return true;
  }
}
