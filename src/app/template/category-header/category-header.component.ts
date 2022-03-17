import { Component, OnInit, OnDestroy } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { CategoryService } from 'src/app/_service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-category-header',
  templateUrl: './category-header.component.html',
  styleUrls: ['./category-header.component.scss']
})

export class CategoryHeaderComponent implements OnInit, OnDestroy {
  categoryDataSubscription: Subscription;
  title = 'AapKabazar-web';
  skeletonCategory:any=[{},{},{},{},{},{},{},{},{},{},{},{}]
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 100,
    navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
    responsive: {
      0: {
        items: 2.5
      },
      400: {
        items: 2
      },
      740: {
        items: 2
      },
      940: {
        items: 9
      }
    },
    nav: true
  }
  rootCategory:any=[];

  constructor(private _CS:CategoryService) { }
  ngOnDestroy(): void {
    this.categoryDataSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.categoryDataSubscription = this._CS.rootCategoryDataSubject.subscribe(data=>{
      this.rootCategory = data;
    })
  }

}
