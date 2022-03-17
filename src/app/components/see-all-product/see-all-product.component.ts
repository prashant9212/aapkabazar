import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService, LocationService, BagService } from 'src/app/_service';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-see-all-product',
  templateUrl: './see-all-product.component.html',
  styleUrls: ['./see-all-product.component.scss']
})
export class SeeAllProductComponent implements OnInit {
  subscription: Subscription;
  city: any = {};
  type: any;
  products: any = []
  constructor(
    private route: ActivatedRoute,
    private _PS: ProductService,
    private _LS: LocationService,
    private _BS: BagService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(data => {
      this.type = data.type;
    })
    this.subscription = this._LS.cityDataSubject.subscribe(data => {
      this.city = data;
      // if (this.city.id != null && data != null) {
        this.getProducts();
      // }
    });
  }

  getProducts() {
    let responseData;
    let params = {};
    if (this.city.id) {
      params["cityId"] = this.city.id
    }
    this._PS.productAvailableByCityId(params).subscribe(data => {
      responseData = data;
      if (this.type == "Latest Product") {
        this.products = responseData.products[0].latestProduct;
      } else if (this.type == "Most View Product" || "Recently View Products") {
        this.products = responseData.products[0].mostViewProduct;
      } else if (this.type == "Most Buy Product") {
        this.products = responseData.mostBuyProduct;
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }
}
