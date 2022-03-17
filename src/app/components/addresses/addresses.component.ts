import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/_service';
import { Subscription } from 'rxjs';
import { AddAddressModalComponent } from 'src/app/components/common/add-address-modal/add-address-modal.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  addressModalRef: BsModalRef;
  subscription: Subscription;
  addressList: any = [];
  isShowSpinner: boolean = true

  constructor(
    private _US: UserService,
    private modelService: BsModalService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.subscription = this._US.addressDataSubject.subscribe(data => {
      this.addressList = data;
    })
    this.getAddress();
  }

  showAddressModal() {
    let initialState = {
      type: 'add'
    }
    this.addressModalRef = this.modelService.show(AddAddressModalComponent, { backdrop: true, ignoreBackdropClick: true, initialState: initialState });
  }

  updateAddress(address) {
    let initialState = {
      address: address
    }
    this.addressModalRef = this.modelService.show(AddAddressModalComponent, { backdrop: true, ignoreBackdropClick: true, initialState: initialState });
  }

  getAddress() {
    this.isShowSpinner = true
    let responseData;
    this._US.getAddress().subscribe(data => {
      this.isShowSpinner = false
      responseData = data;
      this._US.address = responseData.success ? responseData.address : [];
    }, (error) => {
      this.isShowSpinner = false
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  deleteAddress(addressId) {
    let responseData;
    this._US.deleteAddress(addressId).subscribe(data => {
      responseData = data;
      if (responseData.success) {
        this.toastr.success(responseData.message)
        this.getAddress();
      } else {
        this.toastr.warning(responseData.message);
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  setDefaultAddress(addressId) {
    this._US.setDefaultAddress(addressId).subscribe((address: any) => {
      this.getAddress();
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    });
  }

}
