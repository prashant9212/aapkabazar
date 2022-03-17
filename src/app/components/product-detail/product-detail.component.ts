import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { LocationService, ProductService, BagService } from 'src/app/_service';
import { Subscription } from 'rxjs';
import { SeoService } from 'src/app/_service/seo.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  owlOptions: any = {
    loop: true,
    singleItem: true,
    URLhashListener: true,
    slideSpeed: 300,
    startPosition: 'URLHash',
    paginationSpeed: 400,
    items: 1,
  };
  owlImageOptions: any = {
    loop: true,
    mouseDrag: true,
    stagePadding: 2,
    margin: 2,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    navSpeed: 50,
    items: 5,
    slideBy: 5,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 3
      },
      400: {
        items: 4
      },
      740: {
        items: 5
      },
      940: {
        items: 6
      }
    },
    nav: true
  };
  productOwlOption: any = {
    loop: true,
    stagePadding: 5,
    margin: 0,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 50,
    items: 5,
    slideBy: 5,
    navText: ['<', '>'],
    responsive: {
      0: {
        items: 1.2
      },
      400: {
        items: 2.2
      },
      740: {
        items: 3.2
      },
      940: {
        items: 5
      }
    },
    nav: true
  };

  subscription: Subscription;
  product: any = {};
  city: any = {};
  params: any = {};
  bag: any;
 // mostViewProducts: any = [];

  constructor(
    private route: ActivatedRoute,
    private _LS: LocationService,
    private _PS: ProductService,
    private _BS: BagService,
    private _SEO: SeoService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.bag = this._BS.productBag;
    this.city = this._LS.city;
    this.route.params.subscribe((params: Params) => {
      this.params = params;
      this.subscription = this._LS.cityDataSubject.subscribe(data => {
        // if (this.city.id != null && data != null) {
          this.getProduct(this.params.id);
        // }
       // this.getRecentlyViewProduct();
      });
    })
  }
  productResponse: boolean = false;
  getProduct(productId: any) {
    let responseData;
    let params = {
      productId: productId
    }
    if (this.city.id) {
      params["cityId"] = this.city.id
    }
    this._PS.getProductsById(params).subscribe(data => {
      responseData = data;
      this.product = responseData.product;
      this._SEO.updateSeo(this.product.seo);
      this.productResponse = true
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  incrementQuantity() {
    this._BS.incrementQuantity = this.product;
  }

  decrementQuantity() {
    this._BS.decrementQuantity = this.product;
  }

  getRecentlyViewProduct() {
    let params = {};
    if (this.city.id) {
      params["cityId"] = this.city.id
    }
    this._PS.productAvailableByCityId(params).subscribe((data: any) => {
     // this.mostViewProducts = data.products[0].mostViewProduct;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }
}
