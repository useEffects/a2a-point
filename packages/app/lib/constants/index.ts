import Stripe from "stripe";

export * from './env';

export const memberRole = "d880f42a-09e6-401c-8bee-7be133b0d2fe"
export const defaultLimit = 5;
export const appName = 'a2apoint';
export enum ProductType {
  basicPlanMonthly = 'Basic Plan (monthly)',
  basicPlanYearly = 'Basic Plan (yearly)',
  proPlanMonthly = 'Pro Plan (monthly)',
  proPlanYearly = 'Pro Plan (yearly)',
  premiumListingsQuota = 'Premium listings quota',
  advertisementsQuota = 'Advertisements quota',
}
export const basicPlanStripeCodes = {
    monthly: "price_1PxNFdCXSPTRj2WjiBL35ejZ",
    yearly: "price_1PxNFZCXSPTRj2WjJf5mKGdF"
}
export const proPlanStripeCodes = {
    monthly: "price_1PxNFbCXSPTRj2WjnPMsHDAu",
    yearly: "price_1PxNFXCXSPTRj2WjpgdMrCLs"
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
