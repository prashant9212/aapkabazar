
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule} from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { MDBBootstrapModule ,InputsModule,PopoverModule,IconsModule} from 'angular-bootstrap-md';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { HeaderComponent,FooterComponent,CategoryHeaderComponent } from './template';

import { OrderStatusComponent,AddMoneyStatusComponent,HomeComponent ,CategoryComponent,ProductCardComponent,ProductDeliveryComponent ,BagComponent,PriceDetailTableComponent,BannerComponent,FooterCategoryComponent,ProductCarouselComponent,ProductDetailComponent,CheckoutComponent,WalletComponent,OrderComponent,OrderDetailComponent,AddressesComponent,ChangePasswordComponent,HelpCenterComponent, FaqComponent,ProfileSidebarComponent, AddAddressModalComponent,ProfileComponent,SearchedProductsComponent,PaymentOptionComponent,SeeAllProductComponent,ProductCardSkeletonComponent,CategorySkeletonComponent,FooterCategorySkeletonComponent,BannerSkeletonComponent,IssueComponent,ReferralcodeComponent,PromoCodeComponent,ComplaintRegisterComponent,SubscriptionComponent,SubscriptionBagComponent,CityComponent, DeliveryComponent, AllCategoryComponent, BrandProductListComponent, TagProductListComponent, OfferComponent} from './components/index';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { ModalModule } from 'ngx-bootstrap/modal';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { LoginComponent } from './template/header/login/login.component';
import { SkipOtpDirective ,GoogleAutoCompleteDirective, DetectLocationDirective  } from './_directive';
import { CapitalizePipe, ImagePipe, ImageSizePipe, SortPipe } from './_pipe/';
import { AuthGuard } from './_guards';
import { JwtInterceptor, ErrorInterceptor, TokenInterceptor } from './_interceptors';
import { Angulartics2Module } from 'angulartics2';
import { ToastrModule } from 'ngx-toastr';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
// sstatic pages
import {AboutUsComponent,AdvertiseProductsComponent,BecomeAnAffiliateComponent,ConditionOfSaleComponent,DisclaimerComponent,FaqsComponent,PrivacyPolicyComponent,RefundPolicyComponent,SellwithusComponent,ServingAreaComponent,TermsConditionsComponent } from "./components/static-pages/index";
import { FilterPipe } from './_pipe/filter.pipe';
import { RoundoffPipe } from './_pipe/roundoff.pipe';
import { CityGoogleAutocompleteDirective } from './_directive/city-google-autocomplete.directive';
import { NetworkService } from './_service/network.service';
import { NoConnectionComponent } from './components/no-connection/no-connection.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { BnNgIdleService } from 'bn-ng-idle'; // import bn-ng-idle service

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    CategoryHeaderComponent,
    HomeComponent,
    CategoryComponent,
    ProductCardComponent,
    ProductDeliveryComponent,
    BagComponent,
    PriceDetailTableComponent,
    BannerComponent,
    FooterCategoryComponent,
    ProductCarouselComponent,
    ProductDetailComponent,
    CheckoutComponent,
    ImagePipe,
    WalletComponent,
    OrderComponent,
    OrderDetailComponent,
    AddressesComponent,
    ChangePasswordComponent,
    FaqComponent,
    HelpCenterComponent,
    ProfileSidebarComponent,
    AddAddressModalComponent,
    ProfileComponent,
    LoginComponent,
    SkipOtpDirective,
    CapitalizePipe,
    SearchedProductsComponent,
    SortPipe,
    PaymentOptionComponent,
    SeeAllProductComponent,
    ImageSizePipe,
    ProductCardSkeletonComponent,
    CategorySkeletonComponent,
    FooterCategorySkeletonComponent,
    BannerSkeletonComponent,
    IssueComponent,
    GoogleAutoCompleteDirective,
    DetectLocationDirective,
    AboutUsComponent,
    AdvertiseProductsComponent,
    BecomeAnAffiliateComponent,
    ConditionOfSaleComponent,
    DisclaimerComponent,
    FaqsComponent,
    PrivacyPolicyComponent,
    RefundPolicyComponent,
    SellwithusComponent,
    ServingAreaComponent,
    TermsConditionsComponent,
    AddMoneyStatusComponent,
    OrderStatusComponent,
    FilterPipe,
    RoundoffPipe,
    ReferralcodeComponent,
    PromoCodeComponent,
    ComplaintRegisterComponent,
    SubscriptionComponent,
    SubscriptionBagComponent,
    CityComponent,
    CityGoogleAutocompleteDirective,
    NoConnectionComponent,
    DeliveryComponent,
    AllCategoryComponent,
    BrandProductListComponent,
    TagProductListComponent,
    OfferComponent
  ],
  imports: [
    Angulartics2Module.forRoot(),
    ModalModule.forRoot(),
    HttpClientModule,
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    BsDatepickerModule.forRoot(),
    MDBBootstrapModule.forRoot(),
    IconsModule,
    AccordionModule.forRoot(),
    TabsModule.forRoot(),
    TooltipModule.forRoot(),
    InputsModule,
    PopoverModule,
    FormsModule,
    ReactiveFormsModule,
    CarouselModule,
    NgxQRCodeModule,
    ToastrModule.forRoot({
      preventDuplicates:true,
      closeButton:true
    }),
    InfiniteScrollModule,

  ],
  providers: [
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    BnNgIdleService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
