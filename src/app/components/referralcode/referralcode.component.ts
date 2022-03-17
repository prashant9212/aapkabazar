import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-referralcode',
  templateUrl: './referralcode.component.html',
  styleUrls: ['./referralcode.component.scss']
})
export class ReferralcodeComponent implements OnInit {
  recieverAmount:any=0;
  code:any;
  constructor(
    private _US: UserService,
    private toastr:ToastrService
  ) { }

  ngOnInit(): void {
    this.getInvitationData();
  }

  getInvitationData(){
    this._US.getInvitationData().subscribe((refferalCodeRes:any)=>{
      if(refferalCodeRes.success){
        this.code=refferalCodeRes.referalData.code;
        this.recieverAmount = refferalCodeRes.referalData.offer.senderAmount;
      }
      else{
       this.toastr.warning(refferalCodeRes.message);
      }
    },(error)=>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  copyCode(){
    let selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = this.code;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    this.toastr.success('copied')
  }
}
