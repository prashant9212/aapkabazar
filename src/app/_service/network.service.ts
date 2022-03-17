import { Injectable, OnDestroy } from '@angular/core';
import { ConnectionService } from 'ng-connection-service';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  isConnected: Boolean = true


  constructor() { }

  set connected(value) {
    this.isConnected = value
  }

  get connected() {
    return this.isConnected
  }
  
}
