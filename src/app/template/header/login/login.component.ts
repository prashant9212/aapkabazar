import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { UserService } from 'src/app/_service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  login: boolean = true;
  password: boolean = true;
  addPassword: boolean = true;
  otp: boolean = true;
  otplogin: boolean = true;
  forget: boolean = true;
  loginForm: any;
  passwordForm: any;
  otpForm: any;
  addPasswordForm: any;
  userCheckForm: any;
  userData: any = {};
  isShowSpinner: boolean = false
  isShowResendOtp: boolean = false
  isReferalCode: boolean = false
  isShowRefralOption: boolean = false
  userNetworkIp: any = ''

  constructor(
    private loginModalRef: BsModalRef,
    private _US: UserService,
    private toastr: ToastrService) {
    this.loginForm = new FormGroup({
      userId: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\d{10}$/)]))
    });
    this.passwordForm = new FormGroup({
      password: new FormControl('', Validators.required),
    });
    this.otpForm = new FormGroup({
      dig1: new FormControl('', Validators.required),
      dig2: new FormControl('', Validators.required),
      dig3: new FormControl('', Validators.required),
      dig4: new FormControl('', Validators.required),
      referalCode: new FormControl('')
    });
    this.addPasswordForm = new FormGroup({
      password: new FormControl(''),
      confirmPassword: new FormControl('', this.passValidator),
    });

    this.addPasswordForm.controls.password.valueChanges.subscribe(
      x => this.addPasswordForm.controls.confirmPassword.updateValueAndValidity()
    )

    this.userCheckForm = new FormGroup({
      userId: new FormControl('', Validators.compose([Validators.required, Validators.pattern(/^\d{10}$/)]))
    });
  }

  ngOnInit(): void {
    this.login = false
    this.getUserNetowrkIp()
  }

  closeLoginModal() {
    this.login = true;
    this.password = true;
    this.addPassword = true;
    this.otp = true;
    this.loginModalRef.hide()
  }

  getUserNetowrkIp() {
    this._US.getUserNetworkIp().subscribe((res: any) => {
      this.userNetworkIp = res.ip ? res.ip : ""
    })
  }

  register() {
    if (this.loginForm.valid) {
      let responseData;
      this.userData.userId = this.loginForm.value.userId;
      this.userData.netowrkIp = this.userNetworkIp
      this.isShowSpinner = true
      this._US.register(this.userData).subscribe(data => {
        this.isShowSpinner = false
        responseData = data;
        if (responseData.success) {
          this.login = true;
          if (responseData.user.isPasswordSet) {
            this.password = false;
          } else if (!responseData.user.isPasswordSet && responseData.status == "registered") {
            this.addPassword = false;
          } else if (responseData.status == "new" || responseData.status == "old") {
            this.otp = false;
            this.isShowRefralOption = true
          }
        } else {
          this.toastr.warning(responseData.message)
        }
      }, (error) => {
        this.isShowSpinner = false
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
      })
    }
    else {
      return;
    }
  }
  eidtmobile()
  {
    this.otp = true;
    this.otplogin= true;
    this.login = false;
  }
  verifyOtp() {
    if (this.otpForm.valid) {
      this.isShowSpinner = true
      let responseData;
      this.userData.otp = this.otpForm.value.dig1 * 1000 + this.otpForm.value.dig2 * 100 + this.otpForm.value.dig3 * 10 + this.otpForm.value.dig4
      this.userData.referalCode = this.otpForm.value.referalCode
      this._US.otpVerify(this.userData).subscribe(data => {
        this.isShowSpinner = false
        responseData = data
        if (responseData.success) {
          this.otp = true;
          this.addPassword = false;
          this.toastr.success(' OTP Verified ')
        } else {
          this.toastr.warning(' Incorrect OTP')
          this.otpForm.reset()
        }
      }, (error) => {
        this.isShowSpinner = false
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
      })
    }
    else {
      this.otpForm.markAllAsTouched()
    }
  }

  validatePassword() {
    if (this.passwordForm.valid) {
      this.isShowSpinner = true
      let responseData;
      this.userData.password = this.passwordForm.value.password
      this._US.login(this.userData).subscribe(data => {
        this.isShowSpinner = false
        responseData = data;
        if (responseData.success) {
          this._US.userData(responseData.token, responseData.user)
          this.toastr.success('Successfully logged in!');
          this.closeLoginModal()
        } else {
          this.toastr.warning(' Username or password do not match.');
        }
      }, (error) => {
        this.isShowSpinner = false
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
      })
    }
    else {
      this.passwordForm.markAllAsTouched()
    }
  }

  createPassword() {
    if (this.addPasswordForm.valid) {
      this.isShowSpinner = true
      let responseData;
      this.userData.password = this.addPasswordForm.value.password
      this.userData.conPassword = this.addPasswordForm.value.confirmPassword
      this._US.savePassword(this.userData).subscribe(data => {
        this.isShowSpinner = false
        responseData = data;
        if (responseData.success) {
          this._US.userData(responseData.token, responseData.user)
          this.toastr.success('password has been updated')
          this.closeLoginModal()
        } else {
          this.toastr.warning(responseData.message)
        }
      }, (error) => {
        this.isShowSpinner = false
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
      })
    }
    else {
      this.addPasswordForm.markAllAsTouched();
    }
  }

  forgotPassword() {
    this.password = true;
    this.forget = false;
  }

  checkUser() {
    if (this.userCheckForm.valid) {
      this.isShowSpinner = true
      let responseData;
      this.userData.userId = this.userCheckForm.value.userId;
      this._US.forgot(this.userData).subscribe(data => {
        this.isShowSpinner = false
        responseData = data;
        if (responseData.success) {
          this.forget = true;
          this.otp = false;
          this.isShowRefralOption = false
          this.toastr.success(' OTP sent successfully ');
        } else {
          this.toastr.warning(responseData.message)
        }
      }, (error) => {
        this.isShowSpinner = false
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
      })
    }
    else {
      this.userCheckForm.markAllAsTouched()
    }
  }

  resendOtp() {
    let responseData;
    this.isShowResendOtp = true
    this._US.resendOtp(this.userData).subscribe(data => {
      this.isShowResendOtp = false
      responseData = data;
      if (responseData.success) {
        this.toastr.success(' OTP sent successfully ');
        this.otpForm.reset()
      } else {
        this.toastr.warning(responseData.message)
      }
    }, (error) => {
      this.isShowResendOtp = false
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }

  passValidator(control: AbstractControl) {
    if (control && (control.value !== null || control.value !== undefined)) {
      const confirmPassValue = control.value;
      const passControl = control.root.get('password');
      if (passControl) {
        const passValue = passControl.value;
        if (passValue != confirmPassValue || passValue === '') {
          return {
            isError: true
          };
        }
      }
    }
    return null;
  }





  loginOtpSend() {
    let responseData;
    this.isShowResendOtp = true
    this._US.resendOtp(this.userData).subscribe(data => {
      this.isShowResendOtp = false
      responseData = data;
      if (responseData.success) {
        this.toastr.success('OTP Sent Successfully');
        this.otpForm.reset()
        this.otp = true;
        this.login = true;
        this.password = true;
        this.otplogin = false
      } else {
        this.toastr.warning(responseData.message)
      }
    }, (error) => {
      this.isShowResendOtp = false
      this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
    })
  }


  OtpByOTP() {
    if (this.otpForm.valid) {
      this.isShowSpinner = true
      let responseData;
      this.userData.otp = this.otpForm.value.dig1 * 1000 + this.otpForm.value.dig2 * 100 + this.otpForm.value.dig3 * 10 + this.otpForm.value.dig4
      this.userData.referalCode = this.otpForm.value.referalCode
      this._US.otpLoginVerify(this.userData).subscribe(data => {
        this.isShowSpinner = false
        responseData = data
        if (responseData.success) {
          this._US.userData(responseData.token, responseData.user)
          this.toastr.success('Successfully logged in!');
          this.closeLoginModal()
        } else {
          this.toastr.warning(' Username or password do not match.');
        }
      }, (error) => {
        this.isShowSpinner = false
        this.toastr.error(error.error && error.error.message ? error.error.message : error.message);
      })
    }
    else {
      this.otpForm.markAllAsTouched()
    }
  }
}
