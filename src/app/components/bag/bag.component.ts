import { Component, OnInit , OnDestroy,TemplateRef} from '@angular/core';
import { BagService, CheckoutService, LocationService, UserService } from 'src/app/_service';
import { Subscription } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-bag',
  templateUrl: './bag.component.html',
  styleUrls: ['./bag.component.scss']
})
export class BagComponent implements OnInit,OnDestroy {
  subscription:Subscription;
  checkoutPage:any=false;
  bagList:any=[];
  bagPrice:any={};
  bag: any = {};
  order: any = {};

  constructor(
    private _BS:BagService,
    private _US: UserService,
    private toastr: ToastrService,
    private _LS:LocationService,
    private modalService:BsModalService,
    private _CS:CheckoutService) { }

  ngOnInit(): void {
    this.getAddress();
    this.subscription = this._CS.bagPriceDataSubject.subscribe(data=>{
      this.bagPrice = data;
    })
    this.order = this._CS.orderData;
    this.bagList = this._BS.bagList
    this._CS.calculateBagPrice();
    this._CS.orderProduct = this.bagList.map(_ => {
      let product = {
        productId: _._id,
        sellerProductId: _.sellerProductId,
        quantity: _.itemQuantity,
      }
      return product;
    });

    if (localStorage.getItem('cart')) {
      this.bag = JSON.parse(localStorage.getItem('cart'));
    }
  }
  addressLists:any
  address:any
  getAddress() {
    this._US.getAddress().subscribe((addressData: any) => {
      if (addressData.success) {
        this.addressLists=addressData.address;
        let addressList = addressData.address ? addressData.address : [];
        addressList.map((address) => {
          if (address.isDefault) {
            this.address = address;
          }
        })
      } else {
        this.address = {};
        this.toastr.warning(addressData.message);
      }
      this.checkOutOfStockProduct();
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }
  checkOutOfStockProduct() {
    let querry = {};
    querry["products"] = this.order.orderProduct.map(product => {
      return {
        _id: product.productId,
        itemQuantity: product.quantity
      }
    });
    querry["lat"] = this.addressLists[0].latitude;
    querry["lng"] = this.addressLists[0].longitude;
    querry["cityId"] = this._LS.city.id
    querry["area"] = this._LS.city.area
    //console.log(querry);
    this._CS.checkOutOfStock(querry).subscribe((outOfStockData: any) => {
      outOfStockData.products.sellerProductAvailable.map(producta => {   
        //console.log(producta.minSellPrice);
        this.bag[producta.userProducts.productId].sellPrice = producta.sellPrice;
        this.bag[producta.userProducts.productId].minSellPrice = producta.minSellPrice;
        this.bag[producta.userProducts.productId].storeMinQuantity = producta.storeMinQuantity;
        localStorage.setItem('cart', JSON.stringify(this.bag));
      });
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }
  incrementQuantity(product){
    this._BS.incrementQuantity = product;
    this._CS.calculateBagPrice();
  }

  decrementQuantity(product){
    this._BS.decrementQuantity = product;
    this._CS.calculateBagPrice();
  }
  removeProduct(product)
  {
    this._BS.removeCartProduct = product;
    this._CS.calculateBagPrice();
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

}
