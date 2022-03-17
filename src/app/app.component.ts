import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { Angulartics2GoogleAnalytics } from 'angulartics2/ga';
import { ConnectionService } from 'ng-connection-service';
import { Subscription } from 'rxjs';
import { NetworkService } from './_service/network.service';
import { BnNgIdleService } from 'bn-ng-idle'; // import it to your component

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {

  connectionSubscription: Subscription

  constructor(angulartics2GoogleAnalytics: Angulartics2GoogleAnalytics,
    private connectionService: ConnectionService,
    private _NS: NetworkService,
    private metaService: Meta,
    private router:Router,
    private bnIdle: BnNgIdleService) {
    angulartics2GoogleAnalytics.startTracking();
    this.connectionSubscription = this.connectionService.monitor().subscribe(isConnected => {
      this._NS.connected = isConnected
      if(isConnected){
        this.router.navigate(['/']);
      }
      else{
        this.router.navigate(['/no-connection']);
      }
    })
  }

  ngOnInit() {
    // After 2 Min Page Auto Reload
    // this.bnIdle.startWatching(120).subscribe((isTimedOut: boolean) => {
    //   if (isTimedOut) {
    //     window.location.reload();
    //   }
    // });
    this.metaService.updateTag({
      name: 'viewport',
      content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0'
    }, 'name=viewport');
  }

  ngOnDestroy(): void {
    this.connectionSubscription.unsubscribe()
  }
}
