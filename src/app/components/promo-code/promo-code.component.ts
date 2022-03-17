import { Component, OnDestroy, OnInit,TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { LocationService, PaymentService } from 'src/app/_service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-promo-code',
  templateUrl: './promo-code.component.html',
  styleUrls: ['./promo-code.component.scss']
})
export class PromoCodeComponent implements OnInit ,OnDestroy{
  cityDataSubscription:Subscription
  modalRef: BsModalRef;
  promocodes:any = [];
  isReadMore: boolean = false;
  id:any="";
  params:any={}
  isShowSpinner:boolean = false

  constructor(
    private modalService: BsModalService,
    private _PS: PaymentService,
    private toastr:ToastrService,
    private _LS:LocationService
    ) { }

  ngOnInit(): void {
    this.cityDataSubscription=this._LS.cityDataSubject.subscribe(city=>{
      this.getPromoCodes()
    })
  }

  getPromoCodes() {
    this.isShowSpinner = true
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    let responseData;
    this._PS.getPromocode(this.params).subscribe(data => {
      this.isShowSpinner = false
      responseData = data;
      if (responseData.success) {
        this.promocodes = responseData.offer;
      }
    },(error)=>{
      this.isShowSpinner = false
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  copyCode(code){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = code;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
  }

  openModal(promo: TemplateRef<any>) {
    this.modalRef = this.modalService.show(promo);
  }
  readMore(promocode) {
    this.id = promocode._id;
  }
  readLess(){
    this.id="";
  }

  ngOnDestroy(): void {
    this.cityDataSubscription.unsubscribe()
  }
}
