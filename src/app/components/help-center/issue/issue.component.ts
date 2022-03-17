import { Component, OnInit } from '@angular/core';
import { OrderService } from 'src/app/_service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HelpCenterService } from 'src/app/_service/help-center.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-issue',
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {
  issueForm: FormGroup
  deliveredOrders: any = [];
  isProduct: any = 0;
  orderId: any;
  type: any;
  query: any;
  productIds: any = [];
  mbSku: any = [];


  constructor(private _OS: OrderService,
    private formBuilder: FormBuilder,
    private _HS: HelpCenterService,
    private activatedRoute: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router) {

    this.issueForm = this.formBuilder.group({
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)])],
      message: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((queryParams: any) => {
      this.type = queryParams.type;
      this.query = queryParams.query;
      this.orderId = queryParams.orderId;
    })
    this.getOrders();
  }

  getOrders() {
    this._OS.getOrders('').subscribe((placedOrders: any) => {
      let orders = placedOrders.orders;
      if (placedOrders.success) {
        this.deliveredOrders = orders.filter(_ => {
          if (_.status === 'delivered' && _.isIssueRaised==false) {
            return _;
          }
        });
      }
      else {
        this.toastr.error(placedOrders.message);
      }
    },(error)=>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  getSelectedProducts(event, productId, orderId, mbSku) {
    if (event.target.checked) {
      this.productIds.push(productId);
      this.mbSku.push(mbSku);
      this.orderId = orderId;
    }
    else {
      const updateItem = this.productIds.find(this.findProductIdIndex, productId);
      const index = this.productIds.indexOf(updateItem);
      this.productIds.splice(index, 1);
    }
  }

  findProductIdIndex(id) {
    return id === this;
  }

  showHideOrderDetail(indexValue) {
    this.isProduct !== indexValue + 1 ? this.isProduct = indexValue + 1 : this.isProduct = 0;
  }

  raiseComplain() {
    let issueDetail: any = {};
    issueDetail.query = this.query;
    issueDetail.type = this.type
    issueDetail.subject = 'subject';
    issueDetail.orderId = this.orderId;
    issueDetail.productIds = this.productIds;
    issueDetail.orderId = this.orderId;
    issueDetail.MBPId = this.mbSku;
    issueDetail.email = this.issueForm.get('email').value;
    issueDetail.description = this.issueForm.get('message').value;
    this._HS.raiseComplain(issueDetail).subscribe((complainRes: any) => {
      if (complainRes.success) {
        this.toastr.success(complainRes.message);
        this.router.navigate(['/']);
      } else {
        this.toastr.error(complainRes.message);
      }
    },(error)=>{
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }
}
