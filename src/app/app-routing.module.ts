import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent, OrderStatusComponent, AddMoneyStatusComponent, CategoryComponent, BagComponent, ProductDetailComponent, CheckoutComponent, WalletComponent, OrderComponent, OrderDetailComponent, AddressesComponent, ChangePasswordComponent, HelpCenterComponent, FaqComponent, ProfileComponent, SearchedProductsComponent, PaymentOptionComponent, SeeAllProductComponent, IssueComponent, ReferralcodeComponent, PromoCodeComponent, ComplaintRegisterComponent, SubscriptionComponent, SubscriptionBagComponent, InfoPageComponent, CityComponent, DeliveryComponent,AllCategoryComponent, BrandProductListComponent, TagProductListComponent, OfferComponent } from './components/index';
import { AuthGuard } from './_guards';
// sstatic pages
import { AboutUsComponent, AdvertiseProductsComponent, BecomeAnAffiliateComponent, ConditionOfSaleComponent, DisclaimerComponent, FaqsComponent, PrivacyPolicyComponent, RefundPolicyComponent, SellwithusComponent, ServingAreaComponent, TermsConditionsComponent } from "./components/static-pages/index";
import { NoConnectionComponent } from './components/no-connection/no-connection.component';
import { NetworkGuard } from './_guards/network.guard';

const routes: Routes = [
  { path: 'no-connection', component: NoConnectionComponent },
  {
    path: '',
    canActivate: [NetworkGuard],
    // runGuardsAndResolvers:"always",
    children:[
      { path:"",component: HomeComponent},
      { path: ':rootCategoryName/c/:rootCategoryId', component: CategoryComponent },
      { path: ':rootCategoryName/:subCategoryName/c/:rootCategoryId/:subCategoryId', component: CategoryComponent },
      { path: ':rootCategoryName/:subCategoryName/:leafCategoryName/c/:rootCategoryId/:subCategoryId/:leafCategoryId', component: CategoryComponent },
      { path: 'bag', component: BagComponent },
      { path: ':name/p/:id', component: ProductDetailComponent },
      { path: 'checkout', component: CheckoutComponent },
      { path: 'help-center', component: HelpCenterComponent },
      { path: 'issue', component: IssueComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'delivery', component: DeliveryComponent },
      { path: 'sp', component: SearchedProductsComponent },
      { path: 'infop/:id/:title', component: InfoPageComponent },
      { path: 'product/all/:type', component: SeeAllProductComponent },
      { path: 'brand/:brandID', component: BrandProductListComponent },
      { path: 'tags/:tagID', component: TagProductListComponent },
      {
        path: '',
        canActivate: [AuthGuard],
        children: [
          { path: 'payment-option', component: PaymentOptionComponent },
          { path: 'profile', component: ProfileComponent },
          { path: 'order', component: OrderComponent },
          { path: 'order/detail/:id', component: OrderDetailComponent },
          { path: 'address', component: AddressesComponent },
          { path: 'change-password', component: ChangePasswordComponent },
          { path: 'wallet', component: WalletComponent },
          { path: 'addMoney/status', component: AddMoneyStatusComponent },
          { path: 'order/status', component: OrderStatusComponent },
          { path: 'referralcode', component: ReferralcodeComponent },
          { path: 'offers', component: PromoCodeComponent },
          { path: 'complaint-register', component: ComplaintRegisterComponent },
          { path: 'subscription', component: SubscriptionComponent },
          { path: 'subscription-bag', component: SubscriptionBagComponent }
        ]
      },
      { path: 'about-us', component: AboutUsComponent },
      { path: 'advertise-product', component: AdvertiseProductsComponent },
      { path: 'become-affiliate', component: BecomeAnAffiliateComponent },
      { path: 'condition-of-sale', component: ConditionOfSaleComponent },
      { path: 'disclaimer', component: DisclaimerComponent },
      { path: 'faqs', component: FaqsComponent },
      { path: 'privacy-policy', component: PrivacyPolicyComponent },
      { path: 'refund-policy', component: RefundPolicyComponent },
      { path: 'sellwithus', component: SellwithusComponent },
      { path: 'serving-area', component: ServingAreaComponent },
      { path: 'terms-conditions', component: TermsConditionsComponent },
      { path: 'city', component: CityComponent },
      { path: 'all-category', component: AllCategoryComponent },
      { path: 'offer', component:OfferComponent},
      { path: '**', redirectTo: '/' },
    ]
  },

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled', initialNavigation: 'enabled' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
