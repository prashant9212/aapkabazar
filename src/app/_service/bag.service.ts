import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/_service/user.service';

@Injectable({
  providedIn: 'root'
})
export class BagService {
  bag: any = {};
  bagList: any = [];
  bagQuantity:any={
    value:0
  }
  user:any={};

  constructor(
    private http:HttpClient,
    private _US:UserService
  ) {
    localStorage.removeItem('bag');
    if (localStorage.getItem('cart')) {
      this.bag = JSON.parse(localStorage.getItem('cart'));
      Object.keys(this.bag).forEach(key => {
        this.bagList.push(this.bag[key]);
      })
      this.bagList.forEach(product=>{
        this.bagQuantity.value+=product.itemQuantity;
      })
    }
    this._US.userDataSubject.subscribe(user=>{
      this.user = user;
    })
  }

  set incrementQuantity(product: any) {
    if (this.bag[product._id] == null) {
      this.bag[product._id] = product
      this.bag[product._id].itemQuantity = 1;
      this.bagList.push(this.bag[product._id]);
      this.bagQuantity.value++;
    } else if (product.perUserOrderQuantity > this.bag[product._id].itemQuantity) {
      this.bag[product._id].itemQuantity += 1;
      this.bagQuantity.value++;
    }
    localStorage.setItem('cart', JSON.stringify(this.bag));
    if(this.user._id){
      this.addToCart().subscribe();
    }
  }

  set decrementQuantity(product: any) {
    if (this.bag[product._id] != null) {
      this.bag[product._id].itemQuantity -= 1;
      this.bagQuantity.value--;
      if (this.bag[product._id].itemQuantity <= 0) {
        let index = this.bagList.findIndex((_, i) => {
          return _._id === product._id
        })
        if (index !== -1) {
          this.bagList.splice(index, 1)
        }
        delete this.bag[product._id];
      }
    }
    localStorage.setItem('cart', JSON.stringify(this.bag))
    if(this.user._id){
      this.addToCart().subscribe();
    }
  }

  set removeCartProduct(product: any) {
    if (this.bag[product._id] != null) {
      this.bag[product._id].itemQuantity = 0;
      this.bagQuantity.value--;
      if (this.bag[product._id].itemQuantity <= 0) {
        let index = this.bagList.findIndex((_, i) => {
          return _._id === product._id
        })
        if (index !== -1) {
          this.bagList.splice(index, 1)
        }
        delete this.bag[product._id];
      }
    }
    localStorage.setItem('cart', JSON.stringify(this.bag))
    this.bagQuantity.value=0;
    this.bagList.forEach(product=>{
      this.bagQuantity.value+=product.itemQuantity;
    })
    if(this.user._id){
      this.addToCart().subscribe();
    }
  }

  removeProduct(products:any){
    products.forEach(product => {
      if(product.availableQuantity<=0 || !product.isSellerCatActive){
        let index = this.bagList.findIndex((_,i)=>{
          return _._id===product._id
        })
        if(index!==-1){
          this.bagList.splice(index,1)
        }
        delete this.bag[product._id];
      }else{
        this.bag[product._id].itemQuantity=product.availableQuantity;
      }
    });
    this.bagQuantity.value=0;
    this.bagList.forEach(product=>{
      this.bagQuantity.value+=product.itemQuantity;
    })
    localStorage.setItem('cart',JSON.stringify(this.bag))
    if(this.user._id){
      this.addToCart().subscribe();
    }
  }

  addToCart(){
    let bagList = this.bagList.map(_=>{
      return {
        _id: _._id,
        itemQuantity:_.itemQuantity,
        perUserOrderQuantity:_.perUserOrderQuantity
      };
    })
    return this.http.post(environment.apiUrl + 'addtocart', {localStorageData:bagList});
  }

  get productBag() {
    return this.bag;
  }

  get bagQuantityData(){
    return this.bagQuantity;
  }

  get getBagList() {
    return this.bagList;
  }

  resetBag() {
    Object.keys(this.bag).forEach(key => {
      delete this.bag[key];
    })
    while (this.bagList.length) {
      this.bagList.pop();
    }
    this.bagQuantity.value=0;
    localStorage.setItem('cart', JSON.stringify(this.bag))
    if(this.user._id){
      this.addToCart().subscribe();
    }
  }
}
