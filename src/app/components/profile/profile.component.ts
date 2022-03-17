import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { UserService } from 'src/app/_service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  dateValue:any;
  bsInlineValue = new Date();
  bsInlineRangeValue: Date[];
  maxDate = new Date();
  profileForm: any;
  isShowSpinner:boolean=false
  profile:any={name:'',DOB:'',email:'',phoneNo:''};

  constructor(private _US:UserService,
    private toastr:ToastrService) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsInlineRangeValue = [this.bsInlineValue, this.maxDate];
   }

  ngOnInit(): void {
    this.getProfile();
    this.profileForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(''),
      DOB: new FormControl(''),
      phoneNo: new FormControl({value:'',disabled:true})
    });
  }

  getProfile(){
    let responseData;
    this._US.getProfile().subscribe(data=>{
      responseData = data;
      this.profile = responseData.user[0];
      this.profileForm.controls["name"].setValue(this.profile["name"]);
      this.profileForm.controls["email"].setValue(this.profile["email"]);
      this.profileForm.controls["phoneNo"].setValue(this.profile["phoneNo"])
      this.profileForm.controls["DOB"].setValue(this.profile["DOB"]);
      this.dateValue = new Date(this.profile["DOB"]).toLocaleDateString();
      this.profileForm.controls["DOB"].setValue(this.profile["DOB"])
    },(error)=>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  updateProfile(){
    let updateProfile ={
      "Dob" : new Date(this.profileForm.value.DOB).getTime(),
      "email" : this.profileForm.value.email,
      "name" : this.profileForm.value.name,
      "phoneNo" : this.profileForm.value.phoneNo,
      "DOB": this.profileForm.value.DOB
    }
    let responseData;
    this.isShowSpinner=true
    this._US.updateProfile(updateProfile).subscribe(data=>{
      this.isShowSpinner=false
      responseData=data;
      if(responseData.success){
        this.toastr.success('profile Updated successfully');
      }else{
        this.toastr.warning('profile already updated');
      }
    },(error)=>{
      this.isShowSpinner=false
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

}
