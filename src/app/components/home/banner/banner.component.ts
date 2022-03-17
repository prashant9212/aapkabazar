import { Component, OnInit ,Input} from '@angular/core';
import { Router,UrlSegment, UrlSegmentGroup, UrlTree, PRIMARY_OUTLET } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.scss']
})
export class BannerComponent implements OnInit {
  @Input () banners:any=[];

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
  }
  customOptions: OwlOptions = {
    loop: true,
    autoplay:true,
    autoplayHoverPause: true,
    autoplaySpeed: 300,
    fluidSpeed:true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    nav: false,
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },

  }

  navigateToSearchKeyword(url){
    let parsedUrl: UrlTree = this.router.parseUrl(url);
    const g: UrlSegmentGroup = parsedUrl.root.children[PRIMARY_OUTLET];
    const s: UrlSegment[] = g.segments;
    let formattedUrl = `${s.map(p => p.path).join('/')}`;
    this.router.navigate([formattedUrl],{queryParams: parsedUrl.queryParams})
  }

}
