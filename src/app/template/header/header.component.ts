import { Component, OnInit, AfterViewInit, OnDestroy, ViewChild, TemplateRef, ElementRef,NgZone } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';
import { BagService, LocationService, UserService, PaymentService, ProductService, CategoryService, SubscriptionService } from 'src/app/_service';
import { LoginComponent } from 'src/app/template/header/login/login.component'
import { Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

declare let google: any;
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('locationModal') locationModal: TemplateRef<any>;
  @ViewChild('searchModal') searchModal: TemplateRef<any>;
  @ViewChild('search') search: ElementRef
  geocoder:any;

  locationModalRef: BsModalRef;
  loginModalRef: BsModalRef;
  searchModalRef: BsModalRef
  userSubscription: Subscription;
  walletSubscription: Subscription;
  categoryDataSubscription: Subscription;
  bagQuantity: any = {};
  city: any = {};
  cities: any = [];
  user: any = {};
  balance: any;
  searchKey: any;
  locationSearchText: any="";
  searchProductList: any = [];
  rootCategory: any = [];
  showCategory: boolean = false;
  showSearchProduct: boolean = false;
  locationModalConfig = {
    backdrop: true,
    ignoreBackdropClick: true,
    class: "mb-city-modal"
  };


  constructor(
    private _BS: BagService,
    private _LS: LocationService,
    private _US: UserService,
    private _PS: PaymentService,
    private _ProductS: ProductService,
    private _CS: CategoryService,
    private _SS: SubscriptionService,
    private modalService: BsModalService,
    private router: Router,
    private toastr: ToastrService,
    private el:ElementRef,
    private ngZone:NgZone
  ) {
    this.geocoder = new google.maps.Geocoder;
    this.searchKey = new FormControl('');
  }

//  hide:boolean=true;
//  funcs(){
//    this.hide=!this.hide;
//  }
  ngOnInit(): void {
    if(!localStorage.getItem('currentCity')){
      this.searchDefultCity();
    }
    let responseData;
    this.categoryDataSubscription = this._CS.rootCategoryDataSubject.subscribe(data => {
      this.rootCategory = data;
    })
    this._LS.getCity().subscribe(data => {
      responseData = data
      this._LS.cities = responseData.city
      this.cities = this._LS.getCities;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
    this.walletSubscription = this._PS.walletDataSubject.subscribe(data => {
      this.balance = data;
    })
    this.userSubscription = this._US.userDataSubject.subscribe(user => {
      this.user = user;
      if (this.user._id) {
        this.walletBalance();
      }
    });
    this.bagQuantity = this._BS.bagQuantityData;
    this.city = this._LS.city
    this.getCategoryList();
  }

  allcatData:any
  getCategoryList() {
    this._CS.getCategory().subscribe(
      (res: any) => {
        //console.log(res);
        this.allcatData = res.category;
      },
      (err) => {
        console.log(err);
      }
    );
  }
  closeLoginModal()
  {
    this.locationModalRef.hide();
  }
  ngAfterViewInit() {
    if (this.city.name == null) {
      this.showCityDropdown();
      this.getAddress();
    }
    // this.locationModalConfig.backdrop = false
    // this.locationModalConfig.ignoreBackdropClick = false
  }

  getAddress(){
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position)=>{
        let geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        this.geocoder.geocode({location:geolocation},(result,status)=>{
          this.ngZone.run(()=>{
            if(status==="OK"){
              this.searchCity(result[0])
            }
          })
        })
      });
    }
  }

  getZipCode(addresses){
     let address = addresses.filter(data=> data.types.includes("postal_code")
    )
    return address.length>0 && address[0].long_name
  }

  searchCity(event) {
    let zipCode = this.getZipCode(event.address_components)
    this.locationSearchText = event.formatted_address
    let location = {
      lat: event.geometry.location.lat(),
      lng: event.geometry.location.lng(),
      area:zipCode
    }
    this._LS.searchCity(location).subscribe((res: any) => {
      if (res.success) {
        this.locationSearchText = res.data.areaName ? res.data.areaName : res.data.name
        res.data = { ...res.data, ...{address: event.formatted_address},...{area:zipCode} }
        this.setCity(res.data)
      } else {
        this.toastr.warning(res.message)
      }
    }, (err) => {
      this.toastr.error(err.message)
    })
  }
  searchDefultCity() {
    let location = {
      lat: 28.5899848,
      lng: 77.0443796,
      area:"110075"
    }
    this._LS.searchCity(location).subscribe((res: any) => {
      if (res.success) {
        this.locationSearchText = res.data.areaName ? res.data.areaName : res.data.name
        res.data = { ...res.data, ...{address: 'New Delhi, Delhi 110075, India'},...{area:'110075'} }
        this.setCity(res.data)
      } else {
        this.toastr.warning(res.message)
      }
    }, (err) => {
      this.toastr.error(err.message)
    })
  }

  setCity(city) {
    this._LS.city = city;
    //this._BS.resetBag()
    this._CS.setRootCategory(city._id)
    this.locationModalRef.hide();
    //this.router.navigate(['/'])
    window.location.href="/"
  }

  showCityDropdown() {
    this.locationModalRef = this.modalService.show(this.locationModal, this.locationModalConfig);
  }


  walletBalance() {
    let responseData;
    this._PS.getWalletBalance().subscribe(data => {
      responseData = data;
      this._PS.walletBalance = responseData.balance;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  searchProduct(event) {
    if (event.keyCode == 13) {
      this.searchResultPage(this.searchKey.value, null);
    } else {
      let responseData;
      if (this.searchKey.value.length > 1) {
        this._ProductS.searchProductByKeyword(this.searchKey.value, this.user._id, this.city.id).subscribe(data => {
          responseData = data
          if (responseData.success) {
            this.searchProductList = responseData.products;
          } else {
            this.searchProductList = [];
          }
        }, (error) => {
          this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
        })
      }
    }
  }
  searchResultSubmit(searchString) {
    this.searchModalRef.hide();
    this.router.navigate(['/sp'], { queryParams: { searchString: this.searchKey.value, q: this.searchKey.value } });
    // this.searchKey.reset();
  }

  searchResultPage(searchString, categoryId) {
    this.searchModalRef.hide()
    this.searchProductList = [];

    if (categoryId) {
      this.router.navigate(['/sp'], { queryParams: { searchString: searchString, categoryId: categoryId, q: searchString } });
    } else {
      this.router.navigate(['/sp'], { queryParams: { searchString: searchString, q: this.searchKey.value } });
    }
    // this.searchKey.reset();
  }

  login() {
    this.loginModalRef = this.modalService.show(LoginComponent, Object.assign({}, { class: 'mb-login-modal' }));
  }
  logout() {
    this._US.logout();
    this._SS.resetSubscription();
    this.toastr.success('Successfully logged out!');
  }

  openSearchModal() {
    this.searchModalRef = this.modalService.show(this.searchModal, Object.assign({}, { class: 'modal-lg cat-modal', backdrop: false, ignoreBackdropClick: false }))
    this.search.nativeElement.focus()
  }

  ngOnDestroy() {
    this.walletSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }
}
