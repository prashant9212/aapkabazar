import { Component, OnInit } from '@angular/core';
import { DeliverySlotService } from 'src/app/_service'
@Component({
  selector: 'app-product-delivery',
  templateUrl: './product-delivery.component.html',
  styleUrls: ['./product-delivery.component.scss']
})
export class ProductDeliveryComponent implements OnInit {

  slot:any;

  constructor(private _DS:DeliverySlotService) { }

  ngOnInit(): void {
    this.slot = this._DS.getSlot();
  }

}
