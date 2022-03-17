import { Component, OnInit ,Input} from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-product-carousel',
  templateUrl: './product-carousel.component.html',
  styleUrls: ['./product-carousel.component.scss']
})
export class ProductCarouselComponent implements OnInit {

  @Input('products') products:any=[];
  @Input('productResponse') productResponse:any=false;
  @Input() heading:String="";
  skeletonProducts:any=[{},{},{},{},{}];
  productOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    margin:8,
    smartSpeed: 500,
    touchDrag: true,
    pullDrag: true,
    dots: false,
    navSpeed: 700,
    navText: ['<i class="fa fa-angle-left" aria-hidden="true"></i>', '<i class="fa fa-angle-right" aria-hidden="true"></i>'],
    responsive: {
      0: {
        items: 2
      },
      400: {
        items: 2
      },
      740: {
        items: 5
      },
      940: {
        items: 5
      }
    },
    nav: false
  }

  constructor() { }

  ngOnInit(): void {
  }

}
