import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { ToastrService } from 'ngx-toastr';
import { ProductService, LocationService, CategoryService, SeoService } from 'src/app/_service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tag-product-list',
  templateUrl: './tag-product-list.component.html',
  styleUrls: ['./tag-product-list.component.scss']
})
export class TagProductListComponent implements OnInit {
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
    this.getTags();
    this.city = this._LS.city;
    this.route.params.subscribe((params: Params) => {
      this.getTagProducts(params.tagID);
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

  tags:any
  getTags() {
    let responseData;
    this._PS.getTeg().subscribe(data => {
      responseData = data;
      this.tags= responseData.data;
      //console.log(data.data);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }
  onScrollDown(){
    this.start+=1;
    this.route.params.subscribe((params: Params) => {
      this.getTagProducts(params.tagID)
    });
  }
  getTagProducts(tagID) {
    this.isShowLoader=true
    this.isProductListAvailable = false;
    let responseData;
    let params = {
      tagID: tagID
    }
    if (this.city.id) {
      params["cityId"] = this.city.id;
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.gettagProducts(params).subscribe(data => {
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
