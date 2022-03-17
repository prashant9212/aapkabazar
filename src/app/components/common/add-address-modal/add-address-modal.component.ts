import { Component, OnInit, Input, NgZone } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LocationService, UserService, SubscriptionService } from 'src/app/_service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

declare let google: any;

@Component({
  selector: 'app-add-address-modal',
  templateUrl: './add-address-modal.component.html',
  styleUrls: ['./add-address-modal.component.scss']
})
export class AddAddressModalComponent implements OnInit {
  @Input('address') address: any = { fullAddress: '', city: '', area: '', state: '', pincode: '', district: '', country: '', locality: '', route: '', street: '', neighborhood: '' };
  @Input('isSubscription') isSubscription: boolean = false;
  addressSubscription: Subscription;
  addressForm: any;
  isUpdateAddAction: boolean = true;
  subscriptionAddress: any = {};
  subscriptionAddressForm: any;
  blocks: any = [];
  cities: any = [];
  states: any = [];
  societies: any = [];
  isShowSpinner: boolean = false
  type: any = ""

  constructor(
    private _LS: LocationService,
    private _US: UserService,
    private addressModalRef: BsModalRef,
    private toastr: ToastrService,
    private _SS: SubscriptionService,
    private ngZone: NgZone
  ) {
    this.addressSubscription = this._SS.subscriptionAddressDataSubject.subscribe(address => {
      this.subscriptionAddress = address
    })
  }

  ngOnInit(): void {
    this.subscriptionAddressForm = new FormGroup({
      "name": new FormControl('', Validators.required),
      "phoneNo": new FormControl('', Validators.required),
      "state": new FormControl('', Validators.required),
      "city": new FormControl('', Validators.required),
      "society": new FormControl('', Validators.required),
      "block": new FormControl('', Validators.required),
      "flatNo": new FormControl('', Validators.required),
    })
    this.addressForm = new FormGroup({
      "name": new FormControl('', Validators.required),
      "mobileNo": new FormControl('', Validators.compose([Validators.required, Validators.maxLength(10), Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])),
      "line1": new FormControl('', Validators.required),
      "line2": new FormControl('', Validators.required),
      "fullAddress": new FormControl('', Validators.required),
      "type": new FormControl('', Validators.required),
    })
    if (this.address != {}) {
      this.addressForm.controls["name"].setValue(this.address["name"]);
      this.addressForm.controls["type"].setValue(this.address["type"]);
      this.addressForm.controls["line1"].setValue(this.address["line1"]);
      this.addressForm.controls["mobileNo"].setValue(this.address["mobileNo"]);
      this.addressForm.controls["line2"].setValue(this.address["line2"]);
      this.addressForm.controls["fullAddress"].setValue(this.address["fullAddress"]);
    }
    this.addressForm.controls.type.setValue('home');
    if (this.isSubscription) {
      this.getState();
      this.subscriptionAddressForm.controls["name"].setValue(this.subscriptionAddress["name"]);
      this.subscriptionAddressForm.controls["phoneNo"].setValue(this.subscriptionAddress["phoneNo"]);
      this.subscriptionAddressForm.controls["flatNo"].setValue(this.subscriptionAddress["flatNo"]);
    }
    if(this.type === 'add'){
      let city = this._LS.currentCity
      let geocoder = new google.maps.Geocoder;
      geocoder.geocode({ 'address': city.address }, (result, status) => {
        if (status === "OK") {
          if(result.length>0){
            let address = result[0]
            this.onChange(address)
          }
        }
      })
    }
  }

  onChange(address) {
    let address_components = address.address_components;
    //console.log(address);
    if(address["geometry"]["location_type"] == "ROOFTOP")
    {
      this.addressForm.controls["fullAddress"].setValue(address["formatted_address"]);
    }
    if (address["name"]) {
      this.addressForm.controls["fullAddress"].setValue(address["name"] + " " + address["formatted_address"]);
    }

    let location = {
      lat: address.geometry.location.lat(),
      lng: address.geometry.location.lng(),
      areaId: this._LS.city.serveAreaId ? this._LS.city.serveAreaId : "",
      area:this._LS.city.area ? this._LS.city.area : ''
    }
    this._LS.checkAvailabilty(location).subscribe((response: any) => {
      if (response.isAvailable) {
        this.isUpdateAddAction = true;
        this.address = this._LS.filterAddressDetail(address_components, this.address);
        this.address.latitude = location.lat;
        this.address.longitude = location.lng;
        this.address.fullAddress = this.addressForm.value.fullAddress;
      } else {
        this.isUpdateAddAction = false;
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }
  messageForAddress:any
  addAddress() {
    if(this.addressForm.valid && this.isUpdateAddAction){
      if (this.address.fullAddress) {
        this.address.name = this.addressForm.value.name
        this.address.mobileNo = this.addressForm.value.mobileNo
        this.address.line1 = this.addressForm.value.line1
        this.address.line2 = this.addressForm.value.line2
        this.address.type = this.addressForm.value.type
        let responseData;
        this.isShowSpinner = true
        this._US.addNewAddress(this.address).subscribe(data => {
          this.isShowSpinner = false
          responseData = data;
          if (responseData.success) {
            this.toastr.success('address added successfully');
            this.closeAddressModal();
            this.getAddress();
            window.location.reload();
          }
          else {
            this.toastr.warning(responseData.message)
          }
        }, (error) => {
          this.isShowSpinner = false
          this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
        })
      }
      else {
        this.messageForAddress ="* Please Select Delivery Location According to Google";
      }
    }else{
       this.addressForm.markAllAsTouched()
    }
  }

  updateAddress() {
    if (this.addressForm.valid && this.isUpdateAddAction) {
      if(this.address.fullAddress){
        let responseData;
        this.address.name = this.addressForm.value.name
        this.address.mobileNo = this.addressForm.value.mobileNo
        this.address.line1 = this.addressForm.value.line1
        this.address.line2 = this.addressForm.value.line2
        this.address.type = this.addressForm.value.type
        this.isShowSpinner = true
        this._US.updateAddress(this.address).subscribe(data => {
          this.isShowSpinner = false
          responseData = data;
          if (responseData.success) {
            this.toastr.success('address update successfully');
            this.closeAddressModal();
            this.getAddress();
          }
          else {
            this.toastr.warning(responseData.message)
          }
        }, (error) => {
          this.isShowSpinner = false
          this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
        })
      }else{
        this.messageForAddress ="* Please Select Delivery Location According to Google";
      }
    }
    else {
      this.addressForm.markAllAsTouched()
    }
  }

  getAddress() {
    let responseData;
    this._US.getAddress().subscribe(data => {
      responseData = data;
      this._US.address = responseData.address
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  getState() {
    this._LS.getState().subscribe((data: any) => {
      this.states = data.states.map(_ => {
        return _.state;
      })
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  getCitiesByStateName() {
    let state = this.subscriptionAddressForm.value.state;
    this._LS.getCitiesByStateName(state).subscribe((data: any) => {
      this.cities = data.cities;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  getSocietiesByCityId() {
    let cityId = this.subscriptionAddressForm.value.city._id;
    this._LS.getSocietiesByCityId(cityId).subscribe((data: any) => {
      this.societies = data.societies;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  getBlocksBySocityId() {
    let blockId = this.subscriptionAddressForm.value.society._id;
    this._LS.getBlocksBySocietyId(blockId).subscribe((data: any) => {
      this.blocks = data.blocks.block;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  setAddress() {
    let address = {
      name: this.subscriptionAddressForm.value.name,
      mobileNo: this.subscriptionAddressForm.value.phoneNo,
      state: this.subscriptionAddressForm.value.state,
      flatNo: this.subscriptionAddressForm.value.flatNo,
      city: this.subscriptionAddressForm.value.city.name,
      society: this.subscriptionAddressForm.value.society.name,
      addressType: 'society',
      blockNo: this.subscriptionAddressForm.value.block,
      cityId: this.subscriptionAddressForm.value.city._id,
      societyId: this.subscriptionAddressForm.value.society._id,
    }
    this._SS.createAddress(address).subscribe((response: any) => {
      if (response.success) {
        this._SS.address = address;
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
    this.closeAddressModal();
  }


  closeAddressModal() {
    this.addressModalRef.hide();
  }
}
