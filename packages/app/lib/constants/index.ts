import Stripe from 'stripe';

export * from './env';

// export const isDevBuild = Boolean(process.env.NODE_ENV !== "production")
export const isDevBuild = false;

export const directusOrigin = isDevBuild
  ? 'dev.dashboard.a2apoint'
  : 'dashboard.a2apoint';
export const portfolioOrigin = isDevBuild ? 'dev.a2apoint' : 'a2apoint';

export const directusUrl = `https://${directusOrigin}.com`;
export const directusWSUrl = `wss://${directusOrigin}.com/websocket`;
export const portfolioUrl = `https://${portfolioOrigin}.com`;
export const appName = 'a2apoint';
export const messagesFolderId = '4006910f-be8d-43b0-acff-7fe83ed90b43';
export const documentsFolderId = '2e080305-7ca1-4652-8903-d3deab11f5b1';
export const listingsFolderId = '3c995bad-8d9b-4330-a38a-3bad6412a853';
export const savedByMeUrl = `${directusUrl}/admin/content/listings?bookmark=6`;
export const viewedByMeUrl = `${directusUrl}/admin/content/listings?bookmark=7`;

export const memberRole = 'd880f42a-09e6-401c-8bee-7be133b0d2fe';

export const basicPlanStripeCodes = {
  monthly: 'price_1PxNFdCXSPTRj2WjiBL35ejZ',
  yearly: 'price_1PxNFZCXSPTRj2WjJf5mKGdF',
};
export const proPlanStripeCodes = {
  monthly: 'price_1PxNFbCXSPTRj2WjnPMsHDAu',
  yearly: 'price_1PxNFXCXSPTRj2WjpgdMrCLs',
};

export enum ProductType {
  basicPlanMonthly = 'Basic Plan (monthly)',
  basicPlanYearly = 'Basic Plan (yearly)',
  proPlanMonthly = 'Pro Plan (monthly)',
  proPlanYearly = 'Pro Plan (yearly)',
  premiumListingsQuota = 'Premium listings quota',
  advertisementsQuota = 'Advertisements quota',
}

export const products: {
  productType: ProductType;
  stripeCode: string;
  mode: Stripe.Checkout.SessionCreateParams.Mode;
  productId?: string;
}[] = [
  {
    productType: ProductType.basicPlanMonthly,
    stripeCode: basicPlanStripeCodes.monthly,
    mode: 'subscription',
    productId: 'prod_Qp1IGcvEVKZgWl',
  },
  {
    productType: ProductType.basicPlanYearly,
    stripeCode: basicPlanStripeCodes.yearly,
    mode: 'subscription',
    productId: 'prod_Qp1InO2vs85UtO',
  },
  {
    productType: ProductType.proPlanMonthly,
    stripeCode: proPlanStripeCodes.monthly,
    mode: 'subscription',
    productId: 'prod_Qp1IkiUEYyEtte',
  },
  {
    productType: ProductType.proPlanYearly,
    stripeCode: proPlanStripeCodes.yearly,
    mode: 'subscription',
    productId: 'prod_Qp1IpKoPsScCUh',
  },
  {
    productType: ProductType.premiumListingsQuota,
    stripeCode: 'price_1PxNFVCXSPTRj2WjFxZ8p4ou',
    mode: 'payment',
  },
  {
    productType: ProductType.advertisementsQuota,
    stripeCode: 'price_1PxNFTCXSPTRj2WjtTc0EK7o',
    mode: 'payment',
  },
];

export const phoneRegionalCode =
  process.env.NODE_ENV === 'production' ? 'AE' : 'IN';

export const defaultLimit = 5;

export const GLITCHTIP_DSN =
  'https://4a97d8300a684945afc9ac7ab5f50559@glitchtip.a2apoint.com/1';

export const profilePicturesFolderId = '893fcc81-4a29-4b34-a42f-10d0d6591068';
