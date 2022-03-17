import { Component, OnInit,TemplateRef } from '@angular/core';
import { OrderService } from 'src/app/_service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HelpCenterService } from 'src/app/_service';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help-center',
  templateUrl: './help-center.component.html',
  styleUrls: ['./help-center.component.scss']
})
export class HelpCenterComponent implements OnInit {
  orders: any = [];
  otherIssueForm: FormGroup;
  otherIssueDetail: any = {};
  modalRef: BsModalRef;
  isShowSpinner:boolean=false
  constructor(private _OS: OrderService,
    private formBuilder: FormBuilder,
    private _HS: HelpCenterService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private router: Router
    ) {
    this.otherIssueForm = this.formBuilder.group({
      subject: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern(/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/)])],
      mobile: ['', Validators.compose([Validators.maxLength(10), Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")])],
      message: ['', Validators.required]
    })
  }

  ngOnInit(): void {
  }

  raiseOtherIssue() {
    this.isShowSpinner = true;
    this._HS.raiseOtherIssue(this.otherIssueForm.value).subscribe((complainRes: any) => {
      this.isShowSpinner = false;
      if (complainRes.success) {
        this.toastr.success(complainRes.message)
        this.otherIssueForm.reset();
        let data={
          queryParams:{
            date: complainRes.issue.date,
            id: complainRes.issue.id,            
          }
        }
        this.router.navigate(['/complaint-register'],data);
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
  openModal(help: TemplateRef<any>) {
    this.modalRef = this.modalService.show(help);
  }
}
