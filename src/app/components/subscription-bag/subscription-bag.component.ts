import { Component, OnInit,TemplateRef } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-subscription-bag',
  templateUrl: './subscription-bag.component.html',
  styleUrls: ['./subscription-bag.component.scss']
})
export class SubscriptionBagComponent implements OnInit {
  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) { }

  ngOnInit(): void {
  }
  openAddAddressModal(subscriptionAddress: TemplateRef<any>) {
    this.modalRef = this.modalService.show(
      subscriptionAddress,
      Object.assign({}, { class: 'gray' })
    );
  }
}
