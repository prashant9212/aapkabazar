import { Component, OnInit,ViewChild,HostListener } from '@angular/core';
import { ModalDirective } from 'angular-bootstrap-md';
import { ToastrService } from 'ngx-toastr';
import { LocationService, BagService} from 'src/app/_service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @ViewChild('contactModal') contactModal: ModalDirective;
  cities:any=[]
  bagQuantity: any = {};

  constructor(
    private _LS:LocationService,
    private _TS:ToastrService,
    private _BS: BagService,
  ) { }

  ngOnInit(): void {
    this.bagQuantity = this._BS.bagQuantityData;
    this.getCity()
  }
  showContactModal() {
    this.contactModal.show();
  }
  cancel() {
    this.contactModal.hide();
  }

  getCity(){
    this._LS.getCity().subscribe((res:any)=>{
      this.cities=res.city ? res.city : []
      if(this.cities.length>0){
        this.getSocieties()
      }
    },(error)=>{
      this._TS.error(error.message)
    })
  }

  getSocieties(){
    this.cities.map(_=>{
      this._LS.getSocietiesByCityId(_._id).subscribe((res:any)=>{
        _.societies=res.societies ? res.societies : []
      },(error)=>{
        this._TS.error(error.message)
      })
    })
  }



  windowScrolled: boolean;

  @HostListener("window:scroll", [])

  onWindowScroll() {
    if (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop > 100) {
      this.windowScrolled = true;
    }
    else if (this.windowScrolled && window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop < 10) {
      this.windowScrolled = false;
    }
  }

  scrollToTop() {
    (function smoothscroll() {

      var currentScroll = document.documentElement.scrollTop || document.body.scrollTop;

      if (currentScroll > 0) {
        window.requestAnimationFrame(smoothscroll);
        window.scrollTo(0, currentScroll - (currentScroll / 8));
      }

    })();
  }
}
