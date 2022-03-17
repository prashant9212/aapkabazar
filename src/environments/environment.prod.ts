export const environment = {
  production: true,
  pagainationLimit:8,
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
