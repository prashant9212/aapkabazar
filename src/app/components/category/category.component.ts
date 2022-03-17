import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router'
import { ProductService, LocationService, CategoryService, SeoService } from 'src/app/_service';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { OwlOptions } from 'ngx-owl-carousel-o';
import {Location} from '@angular/common';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})

export class CategoryComponent implements OnInit {

  @ViewChild('productUnavailable') productUnavailable: any;
  productUnavailableModalRef: BsModalRef;
  rootCategoryName: any;
  subCategoryName: any;
  leafCategoryName: any;
  city: any;
  products: any = [];
  subCategories: any = [];
  leafCategories: any = { id: "", categories: [] };
  sortArg: any = '';
  sortSearch: any = '';
  skeletonProducts: any = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  isProductListAvailable: boolean = false;
  rootCategoryId: any;
  subCategoryId: any;
  leafCategoryId: any;
  rootCategoryTitle: string = "";
  params:any={}

  constructor(
    private route: ActivatedRoute,
    private _PS: ProductService,
    private _LS: LocationService,
    private _CS: CategoryService,
    private _SEO: SeoService,
    private toastr: ToastrService,
    private _location: Location,
    private bnIdle: BnNgIdleService,
    private modalService: BsModalService,
  ) { }

  refresh(): void {
    window.location.reload();
  }

  RefreshBtn:boolean=false
  ngOnInit(): void {
  //  After 60 Sec. Page Auto Reload
    this.bnIdle.startWatching(60).subscribe((isTimedOut: boolean) => {
      if (isTimedOut) {
        this.RefreshBtn=true;
      }
    });


    this.city = this._LS.city;
    this.route.params.subscribe((params: Params) => {
      this.start=0;
      this.scrollDistance = 1;
      this.scrollUpDistance = 2;
      this.throttle = 300;


      this.rootCategoryId = params.rootCategoryId;
      this.subCategoryId = params.subCategoryId;
      this.leafCategoryId = params.leafCategoryId;
      this.rootCategoryName = params.rootCategoryName;
      this.subCategoryName = params.subCategoryName;
      this.leafCategoryName = params.leafCategoryName;
      if (this.rootCategoryId) {
        this.getSubCategory(this.rootCategoryId);
        this.getCategoryDetailsForPage(this.rootCategoryId);
        if (this.subCategoryId) {
          this.getLeafCategory(this.subCategoryId);
          this.getCategoryDetailsForPage(this.subCategoryId);
          if (this.leafCategoryId) {
            this.getLeafProducts(this.leafCategoryId);
            this.getCategoryDetailsForPage(this.leafCategoryId);
          } else {
            this.getCategoryProducts(this.subCategoryId);
            this.getCategoryDetailsForPage(this.subCategoryId);
          }
        } else {
          this.getCategoryProducts(this.rootCategoryId);
          this.getCategoryDetailsForPage(this.rootCategoryId);
        }
      }
    });
  }

  backClicked()
  {
    this._location.back();
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

  menuInMobile: boolean = false;
  menuOpen(values:any)
  {
    console.log(values);
    if(values== "Open"){
      this.menuInMobile = true;
    }else{
      this.menuInMobile = false;
    }
  }

  getLeafCategory(categoryId: any) {
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    this.isProductListAvailable = false;
    let responseData;
    this._CS.getSubCategory(categoryId,this.params).subscribe(data => {
      this.isProductListAvailable = true;
      responseData = data;
      this.leafCategories.id = categoryId;
      this.leafCategories.categories = responseData.category
    }, (error) => {
      this.isProductListAvailable = true;
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }
  isAllProductEnd: boolean=false;
  isShowLoader:boolean=false
  limit=environment.pagainationLimit;
  start:any=0;
  scrollDistance = 1;
  scrollUpDistance = 2;
  throttle = 300;
  onScrollDown(){
    this.start+=1;
    this.route.params.subscribe((params: Params) => {
      this.rootCategoryId = params.rootCategoryId;
      this.subCategoryId = params.subCategoryId;
      this.leafCategoryId = params.leafCategoryId;
      this.rootCategoryName = params.rootCategoryName;
      this.subCategoryName = params.subCategoryName;
      this.leafCategoryName = params.leafCategoryName;
      if (this.rootCategoryId) {
        this.getSubCategory(this.rootCategoryId);
        if (this.subCategoryId) {
          this.getLeafCategory(this.subCategoryId);
          if (this.leafCategoryId) {
            this.getLeafProducts(this.leafCategoryId);
          } else {
            this.getCategoryProducts(this.subCategoryId);
          }
        } else {
          this.getCategoryProducts(this.rootCategoryId);
        }
      }
    });
  }
  getCategoryProducts(categoryId) {
    this.isShowLoader=true
    this.isProductListAvailable = false;
    let responseData;
    let params = {
      categoryId: categoryId
    }
    if (this.city.id) {
      params["cityId"] = this.city.id;
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.getCategoryProducts(params).subscribe(data => {
      this.isProductListAvailable = true;
      responseData = data;
      // console.log(responseData);
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
      this.isShowLoader=false
      this.isProductListAvailable = true;
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  getLeafProducts(categoryId: any) {
    this.isShowLoader=true
    this.isProductListAvailable = false;
    let responseData;
    let params = {
      categoryId: categoryId,
    }
    if (this.city.id) {
      params["cityId"] = this.city.id
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.getLeafCategoryproducts(params).subscribe(data => {
      this.isProductListAvailable = true;
      responseData = data;
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
      this.isShowLoader=false
      this.isProductListAvailable = true;
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }
  SubCategoryLoad: boolean = false;
  categoryDetails:any
  getSubCategory(categoryId: any) {
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    let responseData;
    this._CS.getSubCategory(categoryId,this.params).subscribe(data => {
      responseData = data;
      this.subCategories = responseData.category;
      this.SubCategoryLoad=true
      // setTimeout( () =>
      //   this.SubCategoryLoad=true
      // , 1000 );
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
    //get currunt selected category details for setting the seo keywords title and description.
    this._CS.getCategoryDetails(categoryId,this.params).subscribe(data => {
      let categoryDetails: any = data;
      if (categoryDetails.category.isRoot) {
        this.rootCategoryTitle = categoryDetails.category.name;
      }
      this._SEO.updateSeo(categoryDetails.category.seo);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })


    this._CS.getCategoryDetails(categoryId,this.params).subscribe(data => {
      this.categoryDetails= data;
      //console.log(this.categoryDetails.category.images);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  categoryDetailsPage:any
  getCategoryDetailsForPage(categoryId)
  {
    this._CS.getCategoryDetails(categoryId,this.params).subscribe(data => {
      this.categoryDetailsPage= data;
      //console.log(this.categoryDetails.category.images);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }

  sortBy(arg, search) {
    this.sortArg = arg;
    this.sortSearch = search;
  }
}
function jquary(document: Document) {
  throw new Error('Function not implemented.');
}

