import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService, PaymentService, HelpCenterService, UserService } from 'src/app/_service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ChatBotService } from 'src/app/_service/chat-bot.service';
import { InvoiceService } from 'src/app/_service/invoice.service';
import * as JsBarcode from 'jsbarcode';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  orderId: any;
  order: any = {};
  totalAmount: any = 0;
  totalSaving: any = 0;
  issueForm: any;
  modalRef: BsModalRef;
  chatModalRef: BsModalRef
  chatdata: any = {
    messages: []
  }
  userData: any = {}
  todayDate = Date.now()
  message: FormControl
  elementType = NgxQrcodeElementTypes.URL;
  correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  qrValue :any= ""

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private _OS: OrderService,
    private _PS: PaymentService,
    private _HS: HelpCenterService,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private _CS: ChatBotService,
    private _US: UserService,
    private _IS:InvoiceService
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
    this.message = new FormControl("")
    this.route.params.subscribe(params => {
      this.orderId = params.id;
      this.qrValue = this.orderId
    });
    this.makeOtherChatsOffline()
    this.orderDetails();
    this._US.userDataSubject.subscribe((user: any) => {
      this.userData = user
    })

    // scoket listeners
    this._CS.listen("userConnected").subscribe((res: any) => {
      this.chatdata = { ...this.chatdata, ...res }
      localStorage.setItem("roomId", res.roomId)
      console.log(this.chatdata)
    })

    this._CS.listen("sendMsg").subscribe((res: any) => {
      console.log(this.chatdata)
      this.chatdata['messages'].push(res)
    })

    //this.getChatDetail()
  }

  orderDetails() {
    let responseData;
    this._OS.getOrderDetails(this.orderId).subscribe(data => {
      responseData = data;
      if (responseData.success) {
        this.order = responseData.order[0];
        this.totalAmount = this.order.orderAmount - this.order.deliveryCharge + (this.order.couponDiscount ? this.order.couponDiscount : 0) + parseFloat(this.order.totalSaving);
        this.totalSaving = parseFloat(this.order.totalSaving) + (this.order.couponDiscount ? this.order.couponDiscount : 0);
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  cancelOrder() {
    let orderData = {
      orderId: this.order.orderId
    }
    let responseData;
    this._OS.cancelOrder(orderData).subscribe(data => {
      responseData = data;
      if (responseData.success) {
        this.toastr.success(responseData.message)
        this.orderDetails();
        this.updateWalletBalance();
      } else {
        this.toastr.warning(responseData.message);
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  updateWalletBalance() {
    let responseData;
    this._PS.getWalletBalance().subscribe(data => {
      responseData = data;
      this._PS.walletBalance = responseData.balance;
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  raiseIssue() {
    let issueDetail = this.issueForm.value;
    if (issueDetail.type == "Other") {
      issueDetail.type = issueDetail.subject == '' ? issueDetail.type : issueDetail.subject
    }
    issueDetail.orderId = this.order.orderId;
    this._HS.raiseComplain(issueDetail).subscribe((complainRes: any) => {
      if (complainRes.success) {
        this.toastr.success(complainRes.message)
        this.issueForm.reset();
        let data = {
          queryParams: {
            date: complainRes.issue.date,
            id: complainRes.issue.id,
          }
        }
        this.router.navigate(['/complaint-register'], data)
      }
      else {
        this.toastr.warning(complainRes.message);
      }
    }, (error) => {
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  openModal(cancel: TemplateRef<any>) {
    this.modalRef = this.modalService.show(cancel);
  }


  // socket events

  joinChat() {
    console.log("chat join")
    let payload = {
      userId: this.userData._id,
      orderId:  this.orderId
    }
    this._CS.emit("userConnected", payload)
  }

  sendMsg() {
    let payload = {
      userMsg: this.message.value,
      roomId: this.chatdata.roomId,
      time:Date.now()
    }
    this._CS.emit("sendMsg", payload)

    if(this.chatdata?.messages?.length<1){
      let payload = {
        adminMsg: "Welcome to Aap Ka Bazar. Thank you for your message. We're unavailable right now, but will respond as soon as possible.",
        roomId: this.chatdata.roomId,
        time:Date.now()
      }
      this._CS.emit("sendMsg", payload)
    }
    this.message.reset()
  }

  getChatDetail() {
    this._CS.getChatDetail(this.orderId).subscribe((res: any) => {
      if (res.success) {
        this.chatdata.roomId = res.data.roomId
        this.chatdata.messages = res.data.messages
        this._CS.emit("joinExistingChat",{roomId:this.chatdata.roomId})
      }
      else{
        this.joinChat()
      }
    })
  }

  makeOtherChatsOffline(){
    this._CS.offlineOtherChat().subscribe((res:any)=>{})
  }
  getInvoice(){
    this._IS.getOrderInvoice(this.orderId).subscribe((res:any)=>{
      if(res.success){
        this.qrValue = res.invoice.id.toString()
        this.generateQrCode();
        this.generateBarCode(res.invoice.id,res)

      }
    },(err)=>{
      this.toastr.error(err.message)
    })
  }

  generateQrCode() {
    const qrcode = document.getElementById('qrcode');
    if(qrcode.firstChild.firstChild != null){
      let imageData = this.getBase64Image(qrcode.firstChild.firstChild);
      this._IS.code.qrCode = imageData;
    }
  }

  getBase64Image(img) {
    if (img) {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL;
    }
  }

  generateBarCode(codeString,invoiceData) {
    const newCanvas = document.createElement('canvas');
    let barCode = new JsBarcode(newCanvas, codeString, {
      format: 'CODE128'
    });
    this._IS.code.barCode = newCanvas.toDataURL('image/png');
    invoiceData.invoice.products.sort((product1,product2)=>{
      return product1.mbSku-product2.mbSku;
    })
    if(invoiceData.invoice.outOfStockProducts.length>0){
      invoiceData.invoice.products.map(_=>{
        invoiceData.invoice.outOfStockProducts.map(outOfStock=>{
          if(_.productId == outOfStock.productId){
            _.quantity-=outOfStock.quantity;
          }
        })
      })
    }
    if(invoiceData.invoice.returnProducts.length>0){
      invoiceData.invoice.products.map(_=>{
        invoiceData.invoice.returnProducts.map(returnProduct=>{
          if(_.productId == returnProduct.productId){
          _.quantity-=returnProduct.quantity;
          }
        })
      })
    }
    this._IS.printInvoice(invoiceData);
  }

}
