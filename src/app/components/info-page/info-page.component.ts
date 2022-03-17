import { Component, OnInit } from '@angular/core';
import { HelpCenterService } from 'src/app/_service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-info-page',
  templateUrl: './info-page.component.html',
  styleUrls: ['./info-page.component.scss']
})
export class InfoPageComponent implements OnInit {
  webPage: any = "";
  isShowSpinner: boolean = true;
  constructor(
    private _HS: HelpCenterService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((data: any) => {
      if (data.id) {
        this.getHtml(data.id);
      }
    })
  }

  getHtml(id) {
    this._HS.getInfoPage(id).subscribe((response: any) => {
      // this.isShowSpinner = false;
      if (response.success && response.data.webPage) {
        this.webPage = this.sanitizer.bypassSecurityTrustHtml(response.data.webPage) ;
      } else {
        this.router.navigate(['/']);
      }
    },(error) =>{
      this.isShowSpinner=false;
      this.router.navigate(['/']);
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }
}
