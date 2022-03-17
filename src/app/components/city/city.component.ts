import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from 'src/app/_service';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit {

  products: any=[];

  constructor(private _PS:ProductService,
    private _TS:ToastrService) { }

  ngOnInit(): void {
    this.productAvailableByCity()
  }

  productAvailableByCity(){
    this._PS.productAvailableByCityId("").subscribe((res:any)=>{
      this.products=res.products ? res.products : []
    },(error)=>{
      this._TS.error(error.message)
    })
  }
}
