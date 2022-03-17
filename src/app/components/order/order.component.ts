import { Component, OnInit, ViewChild, TemplateRef} from '@angular/core';
import { OrderService, HelpCenterService } from 'src/app/_service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  @ViewChild("otherIssueModal") otherIssueModal:TemplateRef<any>;
  modalRef: BsModalRef;
  orders:any=[];
  sortArg:any='';
  sortSearch:any='';
  issueForm:any;
  order:any={};
  isShowSpinner: boolean=false;
  limit:number=8;
  filter:any={}

  constructor(
    private modalService: BsModalService,
    private _OS:OrderService,
    private _HS:HelpCenterService,
    private toastr: ToastrService,
    private router: Router
  ) {
    this.issueForm = new FormGroup({
      type: new FormControl('', [Validators.required]),
      subject: new FormControl(''),
      email: new FormControl('', [Validators.compose([Validators.required, Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)])]),
      mobile: new FormControl('', [Validators.compose([Validators.maxLength(10), Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])]),
      message: new FormControl('', [Validators.required])
    })
  }

  ngOnInit(): void {
    this.filter.page=0;
    this.filter.limit=this.limit;
    this.getOrders()
  }

  getOrders(){
    this.isShowSpinner=true
    let responseData;
    this._OS.getOrders(this.filter).subscribe(data=>{
      this.isShowSpinner=false
      responseData = data;
      if(responseData.success){
        this.orders = [...this.orders,...responseData.orders];
      }
    },(error) =>{
      this.isShowSpinner=false
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
     })
  }

  sortBy(arg){
    this.filter.filter=arg;
    this.orders=[]
    this.filter.page=0
    if(arg == ''){
      delete this.filter['filter']
    }
    this.getOrders()
  }

  openModal(order){
    this.order =order;
    this.modalRef = this.modalService.show(this.otherIssueModal);
  }
  
  closeModal(){
    this.modalRef.hide();
  }

  raiseIssue(){
    this.isShowSpinner = true;
    let issueDetail = this.issueForm.value;
    if(issueDetail.type=="Other"){
      issueDetail.type = issueDetail.subject=='' ? issueDetail.type:issueDetail.subject
    }
    issueDetail.orderId = this.order._id;
    this._HS.raiseComplain(issueDetail).subscribe((complainRes: any) => {
      this.isShowSpinner = false;
      if (complainRes.success) {
        this.toastr.success(complainRes.message)
        this.issueForm.reset();
        this.closeModal();
        let data={
          queryParams:{
            date: complainRes.issue.date,
            id: complainRes.issue.id,            
          }
        }
        this.router.navigate(['/complaint-register'],data)
      }
      else {
        this.toastr.error(complainRes.message);
      }
    },
    error => {
      this.isShowSpinner = false;
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  onScroll(){
    this.filter.page++;
    this.getOrders();
  }

}
