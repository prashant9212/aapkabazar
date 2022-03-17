// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  pagainationLimit:12,
  paytmEnv: 'staging',
  paytmAction: 'https://securegw-stage.paytm.in/order/process',
  payTmConfig: {
    INDUSTRY_TYPE_ID: 'Retail',
    CHANNEL_ID: 'WEB',
    WEBSITE: 'WEBSTAGING',
    MID: 'yWDbFP23634121238860',
  },
  rzpKey:'rzp_live_0zO44DRDrotssm',
  razorPayValues: {
    name: 'Aapkabazar',
    description: 'Order',
    image: '../assets/image/logo.png',
  },
  daysLength:7,
  minWalletAmount:100,
  apiUrl: "https://api.aapkabazar.co/api/",
  socketURL:"https://api.aapkabazar.co"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
