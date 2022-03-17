import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject } from 'rxjs';
import { LocationService } from './location.service';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  rootCategoryDataSubject:any;
  rootCategories:any=[];
  constructor(private http:HttpClient,
    private _LS:LocationService) {
    this.rootCategoryDataSubject = new BehaviorSubject(this.rootCategories);
    let cityId:any=""
    if(this._LS.city.id){
      cityId=this._LS.city.id
    }
    this.setRootCategory(cityId);
  }

  setRootCategory(cityId){
    let responseData
    this.getRootCategory({cityId:cityId}).subscribe(data=>{
      responseData = data;
      this.rootCategory= responseData.category;
    })
  }

  getRootCategory(params){
    return this.http.get(environment.apiUrl+"root/category",{params:params});
  }

  getSubCategory(id: any,params) {
    return this.http.get(environment.apiUrl + `category/subCategory/${id}`,{params:params});
  }

  getCategoryDetails(id: any,params) {
    return this.http.get(environment.apiUrl + `category/details/${id}`,{params:params});
  }
  getCategory() {
    return this.http.get(environment.apiUrl + 'root/category/tree');
  }

  set rootCategory(rootCategories:any){
    this.rootCategories = rootCategories;
    this.rootCategoryDataSubject.next(this.rootCategories);
  }

}
