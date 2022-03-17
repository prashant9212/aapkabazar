import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from "rxjs/operators";
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private _TS:ToastrService,
  ) {}

  
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
        }
    }, (err: any) => {
        if (err instanceof HttpErrorResponse) {
            if (err.status === 401 && err.error.tokenAutorization === false) {
                //remove localstorage and current user from local storage
                this._TS.warning("Session expired. Please Login");
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                this.router.navigate(['/']);
            }
        }
    }));
}
}
