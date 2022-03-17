import { Component, OnInit ,OnDestroy} from '@angular/core';
import { PaymentService } from 'src/app/_service';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-wallet',
  templateUrl: './wallet.component.html',
  styleUrls: ['./wallet.component.scss']
})
export class WalletComponent implements OnInit, OnDestroy{
  walletSubscription:Subscription;
  amountForm:any;
  balance:any;
  transactions:any=[];
  sortArg:any='';
  sortSearch:any='';
  limit:number=8;
  cashBack:any={}
  isShowSpinner:boolean=false;
  isAllTransactionEnd:boolean=false
  filter:any={}

  constructor(
  private _PS:PaymentService,
  private router: Router,
  private toastr:ToastrService
  ) {
    this.amountForm = new FormGroup({
      amount: new FormControl(250,Validators.required),
    })
  }

  ngOnInit(): void {
    this.walletSubscription = this._PS.walletDataSubject.subscribe(data=>{
      this.balance=data;
    })
    this.filter.page=0
    this.filter.limit=this.limit
    this.getTransaction();
    this.updateWalletBalance();
  }

  updateWalletBalance() {
    let responseData;
    this._PS.getWalletBalance().subscribe(data => {
      responseData = data;
      this._PS.walletBalance = responseData.balance;
      this.cashBack=responseData.cashbackWallet ? responseData.cashbackWallet : {}
    },(error)=>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  getTransaction(){
    this.isShowSpinner=true
    let responseData
    this._PS.getTransaction(this.filter).subscribe(data=>{
      this.isShowSpinner=false
      responseData = data;
      if( responseData.success){
        this.transactions = [...this.transactions,...responseData.transactions];
      }
      else{
        this.isAllTransactionEnd=true
      }
    },(error) =>{
      this.isShowSpinner=false
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  setAmount(amount){
    this.amountForm.controls["amount"].setValue(amount)
  }

  addMoney(){
    if(this.amountForm.value.amount>=environment.minWalletAmount){
      let params={
        queryParams:{
          addAmount: this.amountForm.value.amount,
          isOrder:false,
          isWallet:true,
          returnUrl: "wallet"
        }
      }
      this.router.navigate(['payment-option'],params);
    }else{
      console.log("minimum amount to be added in wallet is "+environment.minWalletAmount)
    }
  }

  sortBy(arg){
    this.filter.filter=arg;
    this.filter.page=0;
    this.transactions=[]
    if(arg == 'all'){
      delete this.filter['filter']
    }
    this.getTransaction()
  }

  onScroll(){
    this.filter.page++;
    this.getTransaction();
  }

  ngOnDestroy(): void {
    this.walletSubscription.unsubscribe();
  }
}
