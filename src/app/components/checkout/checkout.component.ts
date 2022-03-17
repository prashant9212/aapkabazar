import { Component, OnInit, OnDestroy, ViewChild, TemplateRef } from '@angular/core';
import { UserService } from 'src/app/_service';
import { Subscription } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddAddressModalComponent } from 'src/app/components/common/add-address-modal/add-address-modal.component';
import { LoginComponent } from 'src/app/template/header/login/login.component'
import { Router } from '@angular/router';
import * as moment from 'moment';
import { DeliverySlotService, BagService, OrderService, PaymentService, LocationService, CheckoutService } from 'src/app/_service';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
  @ViewChild('productUnavailable') productUnavailable: any;
  // @ViewChild('userInfo') userInfo: any;
  addressDataSubscription: Subscription;
  bagPriceDataSubscription: Subscription;
  userDataSubscription: Subscription;
  cityDataSubscription: Subscription;
  loginModalRef: BsModalRef;
  addressModalRef: BsModalRef;
  userInfoModalRef: BsModalRef;
  userInfoForm: any;
  productUnavailableModalRef: BsModalRef;
  checkoutPage: any = true;
  user: any = {};
  addressList: any = [];
  dates: any = [];
  slots: any = {};
  slot: any = {};
  order: any = {};
  bagList: any = [];
  walletBalance: any = 0;
  bagPrice: any = 0;
  allowedDayIndex: any = 0;
  indexOfDayToDeliver: any = 0;
  address: any = {};
  unavailableProducts: any = [];
  bag: any = {};
  selectedSlot: any = {};
  isShowSpinner: boolean = false;
  customerMessage: FormControl
  slotData: any = {}
  ProceedToPaymentButton:any = true;

  constructor(
    private _US: UserService,
    private _CS: CheckoutService,
    private _DS: DeliverySlotService,
    private _PS: PaymentService,
    private _BS: BagService,
    private formBuilder: FormBuilder,
    private _LS: LocationService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.userInfoForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)])],
      phoneNo: ['', Validators.compose([Validators.maxLength(10), Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])]
    })
  }

  ngOnInit(): void {
    this.customerMessage = new FormControl('')
    this.bag = this._BS.productBag;
    this.order = this._CS.orderData;
    this.slots = this._DS.deliverySlots;
    this.slot = this._DS.getSlot();
    this.cityDataSubscription = this._LS.cityDataSubject.subscribe((city: any) => {
      if (city.id) {
        let param = {
          cityId: city.id,
          areaId: city.areaId ? city.areaId : null,
          date: new Date()
        }
        this._DS.getSlots(param);
      }
    })
    this.bagPriceDataSubscription = this._CS.bagPriceDataSubject.subscribe(data => {
      this.bagPrice = data;
    })
    this._PS.walletDataSubject.subscribe(data => {
      this.walletBalance = data;
    })

    this.bagList = this._BS.getBagList;
    this._CS.calculateBagPrice();
    this._CS.orderProduct = this.bagList.map(_ => {
      let product = {
        productId: _._id,
        sellerProductId: _.sellerProductId,
        quantity: _.itemQuantity,
      }
      return product;
    });

    for (let i = 0; i <= 7; i++) {
      const fullDate = new Date();
      fullDate.setDate(fullDate.getDate() + i);
      this.dates = [...this.dates, moment(fullDate)];
    }

    this.addressDataSubscription = this._US.addressDataSubject.subscribe(data => {
      this.addressList = data;
      this.defaultAddress();
    })
    this.userDataSubscription = this._US.userDataSubject.subscribe(user => {
      this.user = user;
      if (this.user._id) {
        this.getAddress();
        this.searchDefultCity();
        if (this.user.email) {
          this.userInfoForm.controls["email"].setValue(this.user.email);
        }
        if (this.user.phoneNo) {
          this.userInfoForm.controls["phoneNo"].setValue(this.user.phoneNo);
        }
      } else {
        this.login();
      }
    })
  }

  openModal(products) {
    products = products.map(product => {
      let productData = product.product;
      productData["availableQuantity"] = product.quantity;
      productData["isSellerCatActive"] = product.isSellerCatActive
      return productData;
    })
    this.unavailableProducts = products
    console.log(this.unavailableProducts)
    this.productUnavailableModalRef = this.modalService.show(this.productUnavailable);
  }

  hideProductUnavailableModal() {
    this.productUnavailableModalRef.hide();
  }

  login() {
    this.loginModalRef = this.modalService.show(LoginComponent, Object.assign({}, { class: 'mb-login-modal' }));
  }

  defaultAddress() {
    let defaultAddress = this.addressList.filter((address) => {
      if (address.isDefault) {
        return address;
      }
    })
    if (defaultAddress.length > 0) {
      this.address = defaultAddress[0];
    } else {
      this.address = {};
    }
    this.deliverHere();
  }

  setDefaultAddress(addressId) {
    this._US.setDefaultAddress(addressId).subscribe((address: any) => {
      this.getAddress();
      this.searchDefultCity();
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    });
  }
  addressLists:any
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
        this.deliverHere();
        this.checkAvailabilty();
        this.ProceedToPaymentButton=true;
      } else {
        this.address = {};
        this.toastr.warning(addressData.message);
        this.ProceedToPaymentButton=false;
      }
      this.getTimeSlots(moment(new Date()))
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  deliverHere() {
    this._CS.address = this.address;
  }
  locationSearchText: any="";
  searchDefultCity() {
    this._US.getAddress().subscribe((addressData: any) => {
      if (addressData.success) {
        this.addressLists=addressData.address;
        let location = {
          lat:addressData.address[0]?.location.lat,
          lng:addressData.address[0]?.location.lng,
          area: addressData.address[0]?.pincode
        }
        this._LS.searchCity(location).subscribe((res: any) => {
          if (res.success) {
            this.locationSearchText = res.data.areaName ? res.data.areaName : res.data.name
            res.data = { ...res.data, ...{address: addressData.address[0]?.fullAddress},...{area:""+addressData.address[0]?.pincode+""} }
            this.setCity(res.data)
            // window.location.reload();
            this.deliverHere();
            this._CS.calculateBagPrice();
            this.ProceedToPaymentButton=true;
          } else {
            this.ProceedToPaymentButton=false;
            this.toastr.warning(res.message)
          }
        }, (err) => {
          this.toastr.error(err.message)
        })
      } else {
        this.address = {};
        this.toastr.warning(addressData.message);
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  setCity(city) {
    this._LS.city = city;
  }

  checkAvailabilty() {
    if (this.address.type) {
      let location = {
        lat: this.address.latitude,
        lng: this.address.longitude,
        areaId: this._LS.city.serveAreaId ? this._LS.city.serveAreaId : "",
        area:this._LS.city.area ? this._LS.city.area : ''
      }
      this._LS.checkAvailabilty(location).subscribe((response: any) => {
        if (response.success) {
          this.checkOutOfStockProduct();
        } else {
          this.toastr.warning(`Delivery address should be of ${this._LS.city.areaName ? this._LS.city.areaName : this._LS.city.name}`);
        }
      }, (error) => {
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
      })
    } else {
      this.toastr.warning("Please add address");
    }
  }

  checkOutOfStockProduct() {
    let querry = {};
    querry["products"] = this.order.orderProduct.map(product => {
      return {
        _id: product.productId,
        itemQuantity: product.quantity
      }
    });
    querry["lat"] = this.address.latitude;
    querry["lng"] = this.address.longitude;
    querry["cityId"] = this._LS.city.id
    querry["area"] = this._LS.city.area
    this._CS.checkOutOfStock(querry).subscribe((outOfStockData: any) => {
      if (outOfStockData.success) {
        if (outOfStockData.products.sellerProductNotAvailable.length > 0) {
          this.openModal(outOfStockData.products.sellerProductNotAvailable);
        }
      }
      else if (outOfStockData.isNoSeller) {
        this.toastr.warning(`Delivery address should be of ${this._LS.city.areaName ? this._LS.city.areaName : this._LS.city.name}`)
        this.updateAddress(this.address)
      }
      else {
        this.toastr.warning(outOfStockData.message)
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  assignDateTime() {
    if (!this.order.deliveryTime) {
      if (this.slotData.nextDeliverySlot) {
        let dayIndex = this.slotData.nextDeliverySlot.indexOf("Today")
        if (dayIndex > 0) {
          this.allowedDayIndex = 0;
        }
        else {
          this.allowedDayIndex = 1
          this.indexOfDayToDeliver = 1
        }
      }

      // if (this.slotData.time.indexOf("Tommorow") != -1) {
      //   this.allowedDayIndex = 1;
      // }
      // this.selectDay(this.allowedDayIndex, "");
    }
  }

  removeItemsFromBag() {
    this._BS.removeProduct(this.unavailableProducts);
    this._CS.calculateBagPrice();
    this._CS.orderProduct = this.bagList.map(_ => {
      let product = {
        productId: _._id,
        sellerProductId: _.sellerProductId,
        quantity: _.itemQuantity,
      }
      return product;
    });
    this.productUnavailableModalRef.hide();
  }

  updateAddress(address) {
    // let data = {
    // };
    let initialState = {
      address: address
    }
    this.addressModalRef = this.modalService.show(AddAddressModalComponent, { backdrop: true, ignoreBackdropClick: true, initialState: initialState });
  }

  addAddress() {
    let initialState = {
      type:"add"
    }
    this.addressModalRef = this.modalService.show(AddAddressModalComponent,{initialState:initialState});
  }

  selectDay(index, day) {
    this.indexOfDayToDeliver = index;
    if (this.slotData.isNewSlot) {
      this.getTimeSlots(day)
    }
    else {
      if (this.indexOfDayToDeliver == 0) {
        this.slots.slotList.forEach(_ => {
          if (_.slot + " Today" === this.slot.time) {
            this.selectTime(_);
          }
        })
      } else {
        this.selectTime(this.slots.slotList[0]);
      }
    }
    // this._CS.day = this.dates[this.indexOfDayToDeliver];
    // console.log(this._CS.day,"day")
    // console.log(this._CS.time,'time')
  }

  selectTime(slot) {
    this._CS.time = slot;
    this.selectedSlot = slot;
    this._CS.day = this.dates[this.indexOfDayToDeliver];
  }
  iagree:any
  selectiagree(slot) {
    this.iagree = slot;
  }
  proceedToPayment() {
    if(this.iagree){
        if(this.selectedSlot){
        // if (this.user.email && this.user.phoneNo) {
        if (this.address.type) {
          let location = {
            lat: this.address.latitude,
            lng: this.address.longitude,
            areaId: this._LS.city.serveAreaId ? this._LS.city.serveAreaId : "",
            area:this._LS.city.area ? this._LS.city.area : ''
          }
          this._LS.checkAvailabilty(location).subscribe((response: any) => {
            if (response.success) {
              let querry = {};
              querry["products"] = this.order.orderProduct.map(product => {
                return {
                  _id: product.productId,
                  itemQuantity: product.quantity
                }
              });
              querry["lat"] = this.address.latitude;
              querry["lng"] = this.address.longitude;
              querry["cityId"] = this._LS.city.id
              querry["area"] = this._LS.city.area
              console.log(querry);
              this._CS.checkOutOfStock(querry).subscribe((outOfStockData: any) => {
                if (outOfStockData.success) {
                  if (outOfStockData.products.sellerProductNotAvailable.length > 0) {
                    this.openModal(outOfStockData.products.sellerProductNotAvailable);
                  } else {
                    let params = {
                      queryParams: {
                        isOrder: true,
                        isWallet: false,
                        returnUrl: "checkout",
                      }
                    }
                    this.order['customerMessage'] = this.customerMessage.value
                    localStorage.setItem("order", JSON.stringify(this.order));
                    this.router.navigate(['payment-option'], params);
                  }
                }
                else if (outOfStockData.isNoSeller) {
                  this.toastr.warning(`Delivery address should be of ${this._LS.city.areaName ? this._LS.city.areaName : this._LS.city.name}`)
                  this.updateAddress(this.address)
                }
                else {
                  this.toastr.warning(outOfStockData.message)
                }
              }, (error) => {
                this.isShowSpinner = false
                this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
              })
            } else {
              this.toastr.warning(response.message);
            }
          }, (error) => {
            this.isShowSpinner = false
            this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
          })
        } else {
          this.toastr.warning("Please add address");
        }
        // } else {
        //   this.openUserInfoModal();
        // }
        }else{
          this.toastr.warning('Please Select Delivery Slot')
        }
      }else{
        this.toastr.warning('Please Select Terms & Condition')
      }
  }

  ngOnDestroy(): void {
    this._CS.resetOrder();
    this.addressDataSubscription.unsubscribe();
    this.bagPriceDataSubscription.unsubscribe();
    this.userDataSubscription.unsubscribe();
    this.cityDataSubscription.unsubscribe();
  }

  // openUserInfoModal() {
  //   this.userInfoModalRef = this.modalService.show(this.userInfo);
  // }

  hideUserInfoModal() {
    this.userInfoModalRef.hide();
  }

  updateProfile() {
    let data: any = {}
    if (!this.user.email) {
      data.email = this.userInfoForm.value['email']
    }
    if (!this.user.phoneNo) {
      data.phoneNo = this.userInfoForm.value['phoneNo']
    }
    this._US.updateProfile(data).subscribe((response: any) => {
      if (response.success) {
        this.assignDateTime();
        this.hideUserInfoModal();
        this.getProfile();
      } else {
        this.toastr.warning(response.message);
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  getProfile() {
    this._US.getProfile().subscribe((response: any) => {
      if (response.success) {
        let user = {
          email: response.user[0].email,
          phoneNo: response.user[0].phoneNo,
          name: response.user[0].name,
          _id: response.user[0]._id,
        }
        this.user.email = response.user[0].email;
        localStorage.setItem('user', JSON.stringify(user));
      } else {
        this.toastr.error(response.message);
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  getTimeSlots(day) {
    let param = {
      date: day._d,
      cityId: this._LS.city.id,
      areaId: this._LS.city.serveAreaId ? this._LS.city.serveAreaId : ""
    }
    this._DS.getSlots(param).subscribe((res: any) => {
      if (res.success) {
        this.slotData = res
        this.slots['slotList'] = res.timeslot ? res.timeslot : []
        this.slots.isDisableSlot = res.disableSlotMsg ? true : false
        this.slots['disableSlotMsg'] = res.disableSlotMsg
        if (res.nextDeliverySlot) {
          this.assignDateTime()
        }
        let selectSlot = this.slots.slotList.filter(_ => _.isDisabled == false)
        if (this.slotData.isOldSlot) {
          let indexOfNextSlot = this.slotData.nextDeliverySlot.indexOf("Tommorow")
          if (indexOfNextSlot != -1) {
            this.selectTime(this.slots.slotList[0])
          }
          else {
            this.selectTime(selectSlot[0])
          }
        } else {
          this.selectTime(selectSlot[0])
        }

      }
    }, (err) => {
      this.toastr.error(err)
    })
  }
}
