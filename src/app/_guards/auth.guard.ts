import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree ,Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
 
  constructor(private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
     return new Promise((resolve)=>{
      let token = JSON.parse(localStorage.getItem('token'));
      if(token){
        resolve(true)
      }else{
        resolve(false)
        this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
      }
    });
  }
  
}