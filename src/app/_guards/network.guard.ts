import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { NetworkService } from '../_service/network.service';

@Injectable({
  providedIn: 'root'
})

export class NetworkGuard implements CanActivate {

  constructor(private router: Router,
    private _NS: NetworkService,
    private _TS: ToastrService) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let status = this._NS.isConnected
    if (status) {
      return true
    } else {
      this._TS.warning("Internet connection lost")
      return false
    }
  }

}
