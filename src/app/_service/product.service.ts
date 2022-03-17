import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  productAvailableByCityId(params) {
    return this.http.get(environment.apiUrl + `homepage`, { params: params });
  }

  getProductsById(params) {
    return this.http.get(environment.apiUrl + `product`, { params: params });
  }

  getCategoryProducts(params) {
    return this.http.get(environment.apiUrl + `category/products/all`, { params: params });
  }
  getBrand() {
    return this.http.get(environment.apiUrl + `brand/all`);
  }
  getBrandDetails(params) {
    return this.http.get(environment.apiUrl + `brand/details`, { params: params });
  }

  getBrandProducts(params) {
    return this.http.get(environment.apiUrl + `brand/products/all`, { params: params });
  }

  getLeafCategoryproducts(params) {
    return this.http.get(environment.apiUrl + `category/products`, { params: params });
  }

  getTeg() {
    return this.http.get(environment.apiUrl + `tag/all`);
  }
  gettagProducts(params) {
    return this.http.get(environment.apiUrl + `tag/products/all`, { params: params });
  }

  searchProductByKeyword(searchKeyword: any, userId: any, cityId: any) {
    return this.http.get(environment.apiUrl + `debounce/search?searchKeyword=${searchKeyword}&userId=${userId}&cityId=${cityId}`);
  }
}
