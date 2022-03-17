 import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService, UserService, LocationService } from 'src/app/_service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-searched-products',
  templateUrl: './searched-products.component.html',
  styleUrls: ['./searched-products.component.scss']
})
export class SearchedProductsComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  locationSubscription: Subscription;
  searchString: any = "";
  categoryId: any;
  user: any = {};
  city: any = {};
  products: any = [];
  searchProductList: any = [];
  skeletonProducts: any = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
  isSearchProductByKeyAvailable: boolean = false;
  searchQuery: any = "";

  categories: any = [
    {
      name: "All"
    }
  ];
  categoriesObj: any = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _PS: ProductService,
    private _LS: LocationService,
    private _US: UserService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.userSubscription = this._US.userDataSubject.subscribe(data => {
      this.user = data;
    });
    this.locationSubscription = this._LS.cityDataSubject.subscribe(data => {
      this.city = data;
    });
    this.route.queryParams.subscribe(data => {
      this.searchQuery = data.q ? data.q : "";
      if (this.searchString == data.searchString && data.categoryId) {
        this.searchProductByCategory(data.categoryId)
      } else {
        this.resetCategoryAndSearch(data.searchString, data.categoryId)
      }
    })
  }

  resetCategoryAndSearch(searchString, categoryId) {
    this.searchString = searchString;
    this.categoriesObj = {};
    this.categories = [
      {
        name: "All"
      }
    ];
    this.searchProductByKey(searchString, categoryId);
  }
  SearchProductLoad: boolean = false;
  searchProductByKey(searchString, categoryId) {
    this.SearchProductLoad = false
    this.isSearchProductByKeyAvailable = false;
    let responseData;
    this._PS.searchProductByKeyword(searchString, this.user._id, this.city.id).subscribe(data => {
      responseData = data
      this.isSearchProductByKeyAvailable = true;
      if (responseData.success) {
        this.searchProductList = responseData.products;
        this.groupByCategory(categoryId);
        setTimeout( () =>
          this.SearchProductLoad = true
        , 1000 );
      } else {
        this.products = [];
      }
    }, (error) => {
      this.isSearchProductByKeyAvailable = true;
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  searchProductByCategory(categoryId) {
    this.SearchProductLoad = false
    let responseData;
    let params = {
      categoryId: categoryId,
      search: this.searchQuery
    }
    if (this.city.id) {
      params["cityId"] = this.city.id
    }
    this._PS.getLeafCategoryproducts(params).subscribe(data => {
      responseData = data
      if (responseData.success) {
        this.products = responseData.products;
        this.SearchProductLoad = true
      } else {
        this.products = [];
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  groupByCategory(categoryId) {
    this.searchProductList.forEach(product => {
      let key = product.category._id;
      if (!this.categoriesObj[key]) {
        this.categoriesObj[key] = 1;
        this.categories.push(product.category)
      }
    })
    if (categoryId) {
      this.searchProductByCategory(categoryId)
    } else {
      this.products = this.searchProductList;
    }
  }

  sortByCategory(category) {
    this.searchProductList = [];
    if (category._id) {
      this.router.navigate(['/sp'], { queryParams: { searchString: this.searchString, categoryId: category._id, q: this.searchQuery } });
    } else {
      this.router.navigate(['/sp'], { queryParams: { searchString: this.searchString, q: this.searchQuery } });
    }

  }

  ngOnDestroy(): void {
    this.locationSubscription.unsubscribe();
    this.userSubscription.unsubscribe();
  }

  searchSidebar: boolean = false;
  searchSidebarOption(value:any)
  {
      if(value == "Open"){
        this.searchSidebar = true;
      }else{
        this.searchSidebar = false;
      }
  }


}
