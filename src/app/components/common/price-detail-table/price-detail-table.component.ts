import { Component, OnInit, Input , OnDestroy, ViewChild,TemplateRef} from '@angular/core';
import { CheckoutService, LocationService, PaymentService} from 'src/app/_service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-price-detail-table',
  templateUrl: './price-detail-table.component.html',
  styleUrls: ['./price-detail-table.component.scss']
})
export class PriceDetailTableComponent implements OnInit, OnDestroy {
  @Input("checkoutPage") checkoutPage:any;
  @ViewChild("promocodeModal") promocodeModal:any;
  promocodeModalRef:BsModalRef;
  bagPriceDataSubscription:Subscription;
  promocodeDataSubscription:Subscription;
  cityDataSubscription:Subscription
  promocodeForm:any;
  promocodeDetails:any={};
  isReadMore: boolean = false;
  bagPrice:any={};
  promocodes:any=[];
  setpromocode:any={};  
  id:any="";
  params:any={}
  toggleClass() {
    this.isReadMore = !this.isReadMore;
  }
  
  constructor(
    public _CS:CheckoutService,
    private _PS:PaymentService,
    private modalService:BsModalService,
    private toastr:ToastrService,
    private _LS:LocationService
    ) {
    this.promocodeForm = new FormGroup({
      "promocode": new FormControl('')
    })
  }

  ngOnInit(): void {
    this.bagPriceDataSubscription = this._CS.bagPriceDataSubject.subscribe(data=>{
      this.bagPrice = data;
    })
    this.promocodeDataSubscription = this._CS.promocodeDataSubject.subscribe(data=>{
      this.promocodeDetails = data;
    })
    this.cityDataSubscription=this._LS.cityDataSubject.subscribe(city=>{
      this.getPromoCodes()
    })
  }

  getPromoCodes(){
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    let responseData;
    this._PS.getPromocode(this.params).subscribe(data=>{
      responseData = data;
      if(responseData.success){
        this.promocodes = responseData.offer;
      }
    },(error)=>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  applyPromocode(){
    if(this.promocodeForm.value.promocode!=''){
      let promocodeData= {
        promocode:this.promocodeForm.value.promocode
      }
      let responseData;
      this._PS.applyPromocode(promocodeData,this.params.cityId).subscribe(data=>{
        responseData = data;
        if(responseData.success){
          if(responseData.promocode.minOrderPrice && this.bagPrice.subTotal<responseData.promocode.minOrderPrice){
            this.toastr.warning("Minimum Order Price should be "+responseData.promocode.minOrderPrice);
          }else{
            this._CS.setPromocode = responseData.promocode;
            this.toastr.success("Promocode valid")          
            this.hidePromocodeModal();
          }
        }else{
          this.toastr.error(responseData.message)
        }
      },(error)=>{
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
      }
      );
    }else{
      this.toastr.error("Promocode require")
    }
  }

  selectPromocode(promocode){
    let responseData;
    this._PS.applyPromocode(promocode,this.params.cityId).subscribe(data=>{
      responseData = data;
      if(responseData.success){
        if(responseData.promocode.minOrderPrice && this.bagPrice.subTotal<responseData.promocode.minOrderPrice){
            this.toastr.warning("Minimum Order Price should be "+responseData.promocode.minOrderPrice);
        }else{
          this._CS.setPromocode = responseData.promocode;
          this.toastr.success("Promocode valid")          
          this.hidePromocodeModal();
        }
      }else{
        this.toastr.error(responseData.message)
      }
    },(error) =>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  addPromocode(){
    this.promocodeModalRef = this.modalService.show(this.promocodeModal);
  }

  removePromocode(){
    this._CS.setPromocode = {};
  }

  hidePromocodeModal(){
    this.promocodeModalRef.hide();
  }

  ngOnDestroy(): void {
    this.bagPriceDataSubscription.unsubscribe();
    this.cityDataSubscription.unsubscribe()
  }
  readMore(promocode) {
    this.id = promocode._id;
  }
  readLess(){
    this.id="";
  }
}
