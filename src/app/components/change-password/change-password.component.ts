import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService, SubscriptionService } from 'src/app/_service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  passwordForm:any;
  isShowSpinner:boolean=false
  constructor(
    private _US:UserService,
    private toastr:ToastrService,
    private _SS:SubscriptionService
  ) { }

  ngOnInit(): void {
    this.passwordForm = new FormGroup({
      currentPassword: new FormControl(''),
      newPassword: new FormControl(''),
      confirmPassword: new FormControl('')
    });
  }

  changePassword(){
    let passwordModel = this.passwordForm.value;
    let responseData;
    if(passwordModel.newPassword==passwordModel.confirmPassword){
      this.isShowSpinner=true
       this._US.changePassword(passwordModel).subscribe(data=>{
         this.isShowSpinner=false
        responseData = data;
        if(responseData.success){
          this.toastr.success(responseData.message)
          this._US.logout();
          this._SS.resetSubscription();
        }else{
          this.toastr.warning('your current password  is wrong ')
        }
      },(error) =>{
        this.isShowSpinner=false
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
      })
    }else{
      this.toastr.error('new Password and confirm password are not same ')
    }

  }

}
