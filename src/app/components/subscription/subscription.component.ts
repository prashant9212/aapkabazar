import { Component, OnInit,TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { SubscriptionService } from 'src/app/_service';
import { ToastrService } from "ngx-toastr";
import { Subscription } from 'rxjs';
import { AddAddressModalComponent } from 'src/app/components/common/add-address-modal/add-address-modal.component';

@Component({
  selector: 'app-subscription',
  templateUrl: './subscription.component.html',
  styleUrls: ['./subscription.component.scss']
})
export class SubscriptionComponent implements OnInit {
  modalRef: BsModalRef;
  addressSubscription:Subscription;
  address:any={};
  subscriptions:any=[];
  showLoader:boolean=false;
  productId:any;
  morningBuyProducts:any=[];
  amount:0;
  items:0;
  addressModalRef:BsModalRef;
  status:any={};

  constructor(
    private _SS:SubscriptionService,
    private toastr:ToastrService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.getAddress();
    this.getSubscription();
    this.getMorningBuyProducts();
    this.addressSubscription = this._SS.subscriptionAddressDataSubject.subscribe((address)=>{
      this.address = address;
    })
    this.getStatus();
  }

  getStatus(){
    this._SS.getStatus().subscribe((data:any)=>{
      this.status=data; 
    },(error)=>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  getAddress(){
    this._SS.getAddress().subscribe((response:any)=>{
      if(response.success){
        this._SS.address=response.subscriptionAddress;
      }
    },(error)=>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  getSubscription(){
    this._SS.getSubscriptions().subscribe((data:any)=>{
      this.subscriptions = data.subscriptions ? data.subscriptions:[];
    },(error)=>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  } 

  getMorningBuyProducts(){
    this._SS.getMorningbBuy().subscribe((data:any)=>{
      this.morningBuyProducts = data.morningBuys ? data.morningBuys:[];
    },(error)=>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  calcualtePrice(){
    this.amount=0;
    this.items=0;
    this.subscriptions.forEach(_ => {
      this.amount+=_.quantity*_.product.sellPrice;
      this.items+=_.quantity;
    });
    this.morningBuyProducts.forEach(_ => {
      this.amount+=_.quantity*_.product.sellPrice;
      this.items+=_.quantity;
    });
  }

  incrementQuantity(subscription){
    if(subscription.quantity<subscription.product.perUserOrderQuantity){
      this.showLoader=true;
      this.productId = subscription.productId;
      let quantity = subscription.quantity+1;
      let data={
        productId:subscription.productId,
        quantity:quantity,
        action:'inc'
      }
      this._SS.updateSubscription(data).subscribe((response:any)=>{
        this.showLoader=false;
        if(response.success){
          this.toastr.success(response.message);
          this.getStatus();
          this.getSubscription();
          this._SS.reloadSubscription();
        }else{
          this.toastr.warning(response.message);
        }
      },(error)=>{
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
      })
    }else{
      this.toastr.warning("Limited quantity available you can't add more of this item");
    }
  }

  decrementQuantity(subscription){
    if(subscription.quantity>-1){
      this.showLoader=true;
      this.productId = subscription.productId;
      let quantity = subscription.quantity-1;
      let data={
        productId:subscription.productId,
        quantity:quantity,
        action:'dec'
      }
      this._SS.updateSubscription(data).subscribe((response:any)=>{
        this.showLoader=false;
        if(response.success){
          this.toastr.success(response.message);
          this.getStatus();
          this.getSubscription();
          this._SS.reloadSubscription();
        }else{
          this.toastr.warning(response.message);
        }
      },(error)=>{
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
      })
    }
  }

  updateMorningbuyQuantity(morningBuyProduct,quantity,action){
    if(morningBuyProduct.quantity<morningBuyProduct.product.perUserOrderQuantity || quantity<morningBuyProduct.quantity){
      this.showLoader=true;
      let data={
        productId:morningBuyProduct.productId,
        quantity:quantity,
        action:action
      }
      this._SS.updateMorningbBuy(data).subscribe((response:any)=>{
        this.showLoader=false;
        if(response.success){
          this.toastr.success(response.message);
          this.getStatus()
          this.getMorningBuyProducts();
          this._SS.reloadMorningBag();
        }else{
          this.toastr.warning(response.message);
        }
      },(error)=>{
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
      })
    }else{
      this.toastr.warning("Limited quantity available you can't add more of this item");
    }
  }

  addNewAddressModal(){
    let data ={
      initialState:{
        isSubscription:true
      }
    };
    this.addressModalRef = this.modalService.show(AddAddressModalComponent,data);
  }

  ngOnDestroy(){
    this.addressSubscription.unsubscribe();
  }
}
