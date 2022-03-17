import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BannersService {
  banner:any=[];
  
  constructor(private http:HttpClient) { }
  
  getBanners(params:any) {
    return this.http.get(environment.apiUrl + `banners`,{params:params});
  }

  get banners(){
    return this.banner;
  }

  set banners(banners){
    this.banner = banners;
  }
}
