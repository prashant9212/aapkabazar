import { Component, OnInit , OnDestroy} from '@angular/core';
import { UserService,SubscriptionService } from 'src/app/_service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-profile-sidebar',
  templateUrl: './profile-sidebar.component.html',
  styleUrls: ['./profile-sidebar.component.scss']
})
export class ProfileSidebarComponent implements OnInit, OnDestroy {
  subscription:Subscription;
  user:any={};
  constructor(
    private _US:UserService,
    private _SS:SubscriptionService  
  ) { }

  ngOnInit(): void {
   this.subscription = this._US.userDataSubject.subscribe(data=>{
      this.user = data;
    })
  }

  logout(){
    this._US.logout();
    this._SS.resetSubscription();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
