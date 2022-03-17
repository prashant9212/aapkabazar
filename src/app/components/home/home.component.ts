import { Component, OnInit, OnDestroy } from '@angular/core';
import { BannersService, ProductService, CategoryService, LocationService, SeoService, DeliverySlotService } from 'src/app/_service/index';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { CarouselModule } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {


  customOptions: CarouselModule = {
    loop: true,
    autoplay:true,
    autoplayTimeout:7000,
    autoplayHoverPause:false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    margin:20,
    stagePadding: 40,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
        margin:10
      },
      767: {items: 1},
      940: {items: 3}
    },
    nav: true
  }  
  slides = [
    {id: 1, link:"undefined/p/61eaecb12da73066de6b4477", img: "../../../assets/image/slider/slider1.jpg"},
    {id: 2, link:"undefined/p/61eaecaf2da73066de6b330b", img: "../../../assets/image/slider/slider2.jpg"},
    {id: 3, link:"undefined/p/622d772cf8dbd3675c44c5ca", img: "../../../assets/image/slider/slider3.jpg"},
    {id: 4, link:"undefined/p/61eaecb02da73066de6b3c94", img: "../../../assets/image/slider/slider4.jpg"}
  ];


  //******Top-Banner******/
  MainBanner: CarouselModule = {
    loop: true,
    autoplay:true,
    autoplayTimeout:7000,
    autoplayHoverPause:false,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1,
      }
    },
    nav: false
  }  
  MainBanner1Web = [{id: 1, link:"undefined/p/62075dce7cdcbc7989c4bd4a", img: "../../../assets/image/banners/top_banner/web/holi.jpg"}, {id: 2, link:"undefined/p/61eaecb12da73066de6b42e7", img: "../../../assets/image/banners/top_banner/web/badam.jpg"},];
  MainBanner1App = [{id: 1, link:"undefined/p/62075dce7cdcbc7989c4bd4a", img: "../../../assets/image/banners/top_banner/app/holi.jpg"}, {id: 2, link:"undefined/p/61eaecb12da73066de6b42e7", img: "../../../assets/image/banners/top_banner/app/badam.jpg"},];
  MainBanner2Web = [{id: 1, link:"undefined/p/61eaecb12da73066de6b4621", img: "../../../assets/image/banners/top_banner/web/gauritibar.jpg"},{id: 2, link:"undefined/p/61eaecaf2da73066de6b3674", img: "../../../assets/image/banners/top_banner/web/surfexcelfrontload.jpg"},];
  MainBanner2App = [{id: 1, link:"undefined/p/61eaecb12da73066de6b4621", img: "../../../assets/image/banners/top_banner/app/gauritibar.jpg"},{id: 2, link:"undefined/p/61eaecaf2da73066de6b3674", img: "../../../assets/image/banners/top_banner/app/surfexcelfrontload.jpg"},];
  MainBanner3Web = [{id: 1, link:"undefined/p/61eaecb12da73066de6b4614", img: "../../../assets/image/banners/top_banner/web/saffolagold5.jpg"},{id: 2, link:"undefined/p/61eaecaf2da73066de6b3952", img: "../../../assets/image/banners/top_banner/web/elaichi.jpg"},];
  MainBanner3App = [{id: 1, link:"undefined/p/61eaecb12da73066de6b4614", img: "../../../assets/image/banners/top_banner/app/saffolagold5.jpg"},{id: 2, link:"undefined/p/61eaecb12da73066de6b4632", img: "../../../assets/image/banners/top_banner/app/bluebari.jpg"}, ];

//******Top-Banner******/




  cityDataSubscription: Subscription;
  categoryDataSubscription: Subscription;
  mostViewProduct: any = [];
  mostBuyProduct: any = [];
  latestProduct: any = [];
  city: any = {};
  rootCategories: any = [];
  banners: any = [];
  bannerResponse: boolean = false;
  bannerResponses: boolean = false;
  productResponse: boolean = false;
  footerCategorySkeleton: any = [{}, {}, {}, {}, {}, {}, {}, {}];
  deliveryCharges: any = {}
  param:any={}
  seoData: any = {
    metaKeywords: ['online fruits and vegetables in delhi'],
    metaDescription: 'Grocery Store in Dwarka | Online Grocery Store in Dwarka | Aap Ka Bazar',
    metaTitle: 'Grocery Store in Dwarka | Online Grocery Store in Dwarka | Aap Ka Bazar'
  };
  brand: any = [];
  apiURL=environment.apiUrl;
  constructor(
    private _PS: ProductService,
    private _CS: CategoryService,
    private _LS: LocationService,
    private _BS: BannersService,
    private _SEO: SeoService,
    public _DSS: DeliverySlotService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.getTags();
    this.getBrand();
    this.getBanners();
    this._SEO.updateSeo(this.seoData);

    this.cityDataSubscription = this._LS.cityDataSubject.subscribe(data => {
      this.city = data;
      // if (this.city.id != null && data != null) {
      // this.productAvailableByCityId();
      // }
      // this.getBanners()
    });
    this.categoryDataSubscription = this._CS.rootCategoryDataSubject.subscribe(data => {
      this.rootCategories = data;
    })
    //this.foodGrainss();
    //this.Beveragesss();
    //this.Hygieness();
    //this.Snacksss();
    //this.Exoticss();
    //this.Babycaress();
    //this.Frozenss();
    //this.Cleaningss();
  }
  getBrand() {
    let responseData;
    this._PS.getBrand().subscribe(data => {
      responseData = data;
      this.brand= responseData.brand;
      //console.log(this.brand);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
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


  getBanners() {
    let responseData;
    if(this._LS.city.id){
      this.param.cityId=this._LS.city.id
    }else{
      this.param.cityId="619f219d26d9ad0f34102dd2";
    }
    this._BS.getBanners(this.param).subscribe(data => {
      responseData = data;
      this._BS.banners = responseData.banners ? responseData.banners : [];
      this.banners = this._BS.banners;
      setTimeout( () =>
        this.bannerResponse = true
      , 500 );

    }, (error) => {
      this.bannerResponse = true;
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  productAvailableByCityId() {
    let responseData;
    let params = {};
    if(this.city.id){
      params["cityId"] = this.city.id
    }
    this._PS.productAvailableByCityId(params).subscribe(data => {
      responseData = data;
      this.productResponse = true;
      this.latestProduct = responseData.products[0].latestProduct ? responseData.products[0].latestProduct : [];
      this.mostViewProduct = responseData.products[0].mostViewProduct ? responseData.products[0].mostViewProduct : [];
      this.mostBuyProduct = responseData.mostBuyProduct ? responseData.mostBuyProduct : [];
    }, (error) => {
      this.productResponse = true;
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  ngOnDestroy() {
    this.cityDataSubscription.unsubscribe();
    this.categoryDataSubscription.unsubscribe();
  }

  limit=environment.pagainationLimit;
  start:any=0;
  params:any={}







  foodGrains:any
  foodGrain:any
  foodGrainproducts:any
  foodGraincategoryDetails:any
  foodGrainss() {
    this.foodGrain='61b18e41c5aed278ca11c069';
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    let responseData;
    this._CS.getSubCategory(this.foodGrain,this.params).subscribe(data => {
      responseData = data;
      //console.log(responseData);

      this.foodGrains = responseData.category;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })

    let responseDataa;
    let params = {
      categoryId: this.foodGrain
    }
    if (this.city.id) {
      params["cityId"] = this.city.id;
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.getCategoryProducts(params).subscribe(data => {
      responseDataa = data;
      this.productResponse = true;
       this.foodGrainproducts = responseDataa.products ? responseDataa.products : [];
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
    this._CS.getCategoryDetails(this.foodGrain,this.params).subscribe(data => {
       this.foodGraincategoryDetails= data;
      //console.log(this.foodGraincategoryDetails.category.images);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }




  Beveragess:any
  Beverages:any
  Beveragesproducts:any
  BeveragescategoryDetails:any
  Beveragesss() {
    this.Beverages='61b19199c5aed278ca11c0a8';
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    let responseData;
    this._CS.getSubCategory(this.Beverages,this.params).subscribe(data => {
      responseData = data;
      //console.log(responseData);

      this.Beverages = responseData.category;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })

    let responseDataa;
    let params = {
      categoryId: this.Beverages
    }
    if (this.city.id) {
      params["cityId"] = this.city.id;
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.getCategoryProducts(params).subscribe(data => {
      responseDataa = data;
       this.Beveragesproducts = responseDataa.products ? responseDataa.products : [];
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
    this._CS.getCategoryDetails(this.Beverages,this.params).subscribe(data => {
       this.BeveragescategoryDetails= data;
      //console.log(this.BeveragescategoryDetails.category.images);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }



  Hygienes:any
  Hygiene:any
  Hygieneproducts:any
  HygienecategoryDetails:any
  Hygieness() {
    this.Hygiene='61b19150c5aed278ca11c096';
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    let responseData;
    this._CS.getSubCategory(this.Hygiene,this.params).subscribe(data => {
      responseData = data;
      //console.log(responseData);

      this.Hygiene = responseData.category;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })

    let responseDataa;
    let params = {
      categoryId: this.Hygiene
    }
    if (this.city.id) {
      params["cityId"] = this.city.id;
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.getCategoryProducts(params).subscribe(data => {
      responseDataa = data;
       this.Hygieneproducts = responseDataa.products ? responseDataa.products : [];
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
    this._CS.getCategoryDetails(this.Hygiene,this.params).subscribe(data => {
       this.HygienecategoryDetails= data;
       //console.log(this.HygienecategoryDetails.category.images);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }



  Snackss:any
  Snacks:any
  Snacksproducts:any
  SnackscategoryDetails:any
  Snacksss() {
    this.Snacks='61b19188c5aed278ca11c09f';
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    let responseData;
    this._CS.getSubCategory(this.Snacks,this.params).subscribe(data => {
      responseData = data;
      //console.log(responseData);

      this.Snacks = responseData.category;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })

    let responseDataa;
    let params = {
      categoryId: this.Snacks
    }
    if (this.city.id) {
      params["cityId"] = this.city.id;
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.getCategoryProducts(params).subscribe(data => {
      responseDataa = data;
       this.Snacksproducts = responseDataa.products ? responseDataa.products : [];
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
    this._CS.getCategoryDetails(this.Snacks,this.params).subscribe(data => {
       this.SnackscategoryDetails= data;
       //console.log(this.SnackscategoryDetails.category.images);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }



  Exotics:any
  Exotic:any
  Exoticproducts:any
  ExoticcategoryDetails:any
  Exoticss() {
    this.Exotic='61b191bac5aed278ca11c0b1';
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    let responseData;
    this._CS.getSubCategory(this.Exotic,this.params).subscribe(data => {
      responseData = data;
      //console.log(responseData);

      this.Exotics = responseData.category;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })

    let responseDataa;
    let params = {
      categoryId: this.Exotic
    }
    if (this.city.id) {
      params["cityId"] = this.city.id;
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.getCategoryProducts(params).subscribe(data => {
      responseDataa = data;
       this.Exoticproducts = responseDataa.products ? responseDataa.products : [];
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
    this._CS.getCategoryDetails(this.Exotic,this.params).subscribe(data => {
       this.ExoticcategoryDetails= data;
       //console.log(this.ExoticcategoryDetails.category.images);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }






  Babycares:any
  Babycare:any
  Babycareproducts:any
  BabycarecategoryDetails:any
  Babycaress() {
    this.Babycare='61b191d3c5aed278ca11c0ba';
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    let responseData;
    this._CS.getSubCategory(this.Babycare,this.params).subscribe(data => {
      responseData = data;
      //console.log(responseData);

      this.Babycares = responseData.category;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })

    let responseDataa;
    let params = {
      categoryId: this.Babycare
    }
    if (this.city.id) {
      params["cityId"] = this.city.id;
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.getCategoryProducts(params).subscribe(data => {
      responseDataa = data;
       this.Babycareproducts = responseDataa.products ? responseDataa.products : [];
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
    this._CS.getCategoryDetails(this.Babycare,this.params).subscribe(data => {
       this.BabycarecategoryDetails= data;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }


  Frozens:any
  Frozen:any
  Frozenproducts:any
  FrozencategoryDetails:any
  Frozenss() {
    this.Frozen='61b18e68c5aed278ca11c072';
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    let responseData;
    this._CS.getSubCategory(this.Frozen,this.params).subscribe(data => {
      responseData = data;
      //console.log(responseData);

      this.Frozens = responseData.category;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })

    let responseDataa;
    let params = {
      categoryId: this.Frozen
    }
    if (this.city.id) {
      params["cityId"] = this.city.id;
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.getCategoryProducts(params).subscribe(data => {
      responseDataa = data;
       this.Frozenproducts = responseDataa.products ? responseDataa.products : [];
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
    this._CS.getCategoryDetails(this.Frozen,this.params).subscribe(data => {
       this.FrozencategoryDetails= data;
       //console.log(this.FrozencategoryDetails.category.images);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }




  Cleanings:any
  Cleaning:any
  Cleaningproducts:any
  CleaningcategoryDetails:any
  Cleaningss() {
    this.Cleaning='61b1912dc5aed278ca11c08d';
    if(this._LS.city.id){
      this.params.cityId=this._LS.city.id
    }
    let responseData;
    this._CS.getSubCategory(this.Cleaning,this.params).subscribe(data => {
      responseData = data;
      //console.log(responseData);

      this.Cleanings = responseData.category;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })

    let responseDataa;
    let params = {
      categoryId: this.Cleaning
    }
    if (this.city.id) {
      params["cityId"] = this.city.id;
    }
    params["start"] = this.start;
    params["limit"] = this.limit;
    this._PS.getCategoryProducts(params).subscribe(data => {
      responseDataa = data;
       this.Cleaningproducts = responseDataa.products ? responseDataa.products : [];
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
    this._CS.getCategoryDetails(this.Cleaning,this.params).subscribe(data => {
       this.CleaningcategoryDetails= data;
       //console.log(this.CleaningcategoryDetails.category.images);
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message)
    })
  }


  
}
