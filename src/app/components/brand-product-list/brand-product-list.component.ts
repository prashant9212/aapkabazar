import { environment } from 'src/environments/environment';
import { ActivatedRoute,Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService, LocationService, CategoryService, SeoService } from 'src/app/_service';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-brand-product-list',
  templateUrl: './brand-product-list.component.html',
  styleUrls: ['./brand-product-list.component.scss']
})
export class BrandProductListComponent implements OnInit {
  params:any={}
  city: any;
  limit=environment.pagainationLimit;
  start:any=0;
  scrollDistance = 1;
  scrollUpDistance = 2;
  throttle = 300;
  products: any = [];
  isAllProductEnd: boolean=false;
  isShowLoader:boolean=false
  isProductListAvailable: boolean = false;
  skeletonProducts: any = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  sortArg: any = '';
  sortSearch: any = '';
  brand: any = [];
  apiURL=environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private _PS: ProductService,
    private _LS: LocationService,
    private _CS: CategoryService,
    private _SEO: SeoService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getBrand();
    this.city = this._LS.city;
    this.route.params.subscribe((params: Params) => {
      this.getBrandProducts(params.brandID);
      //this.getBranddetails(params.brandID)
    });
  }
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    nav: false,
    responsive: {
      0: {
        items: 3
      },
      400: {
        items: 3
      },
      740: {
        items: 4
      },
      940: {
        items: 4
      }
    },

  }

  getBrand() {
    let responseData;
    this._PS.getBrand().subscribe(data => {
      responseData = data;
      this.brand= responseData.brand;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }
  branddetails:any
  getBranddetails(brandID) {
    let responseData;
    let params = {
      brandID: brandID
    }
    this._PS.getBrandDetails(params).subscribe(data => {
      responseData = data;
      this.branddetails= responseData.brand[0];
      console.log(this.branddetails);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }
  onScrollDown(){
    this.start+=1;
    this.route.params.subscribe((params: Params) => {
      this.getBrandProducts(params.brandID)
    });
  }
  getBrandProducts(brandID) {
    this.isShowLoader=true
    this.isProductListAvailable = false;
    let responseData;
    let params = {
      brandID: brandID
    }
    if (this.city.id) {
      params["cityId"] = this.city.id;
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.getBrandProducts(params).subscribe(data => {
      this.isProductListAvailable = true;
      responseData = data;
      console.log(responseData);
      // this.products = responseData.products ? responseData.products : [];
      this.isShowLoader=false
      if(responseData.success){
        if(this.start==0){
          this.products=responseData.products
        }
        else{
          this.products=[...this.products,...responseData.products]
        }
      }
      else{
        if(this.start==0){
          this.toastr.error(responseData.message);
          this.products=[]
        }
        else{
          this.isAllProductEnd=true;
        }
      }
    }, (error) => {
      this.isShowLoader=false;
      this.isProductListAvailable = true;
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }
  sortBy(arg, search) {
    this.sortArg = arg;
    this.sortSearch = search;
  }
}
