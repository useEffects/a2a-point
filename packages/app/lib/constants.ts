import Stripe from "stripe"

export const directusUrl = "https://dashboard.a2apoint.com";
export const directusWSUrl = "wss://dashboard.a2apoint.com/websocket";
export const portfolioUrl = "https://a2apoint.com"
export const appName = "a2apoint"
export const messagesFolderName = "4006910f-be8d-43b0-acff-7fe83ed90b43"
export const savedByMeUrl = `${directusUrl}/admin/content/listings?bookmark=6`
export const viewedByMeUrl = `${directusUrl}/admin/content/listings?bookmark=7`

export const basicPlanStripeCodes = {
    monthly: "price_1POIoQCXSPTRj2Wj7dkgRn4d",
    yearly: "price_1POIyzCXSPTRj2WjdgbDZYge"
}
export const proPlanStripeCodes = {
    monthly: "price_1POIxACXSPTRj2WjrlgGAnro",
    yearly: "price_1POJ0TCXSPTRj2WjszJgywln"
}

export enum ProductType {
    basicPlanMonthly = "Basic Plan (monthly)",
    basicPlanYearly = "Basic Plan (yearly)",
    proPlanMonthly = "Pro Plan (monthly)",
    proPlanYearly = "Pro Plan (yearly)",
    premiumListingsQuota = "Premium listings quota",
    advertisementsQuota = "Advertisements quota"
}

export const products: {
    productType: ProductType,
    stripeCode: string,
    mode: Stripe.Checkout.SessionCreateParams.Mode,
    productId?: string
}[] = [
        {
            productType: ProductType.basicPlanMonthly,
            stripeCode: basicPlanStripeCodes.monthly,
            mode: "subscription",
            productId: "prod_QEmNPbVsqTptZ8"
        },
        {
            productType: ProductType.basicPlanYearly,
            stripeCode: basicPlanStripeCodes.yearly,
            mode: "subscription",
            productId: "prod_QEmYe5USYsicoP"
        },
        {
            productType: ProductType.proPlanMonthly,
            stripeCode: proPlanStripeCodes.monthly,
            mode: "subscription",
            productId: "prod_QEmWM4RLCJ1iEa"
        },
        {
            productType: ProductType.proPlanYearly,
            stripeCode: proPlanStripeCodes.yearly,
            mode: "subscription",
            productId: "prod_QEmZBdUPk5m06O"
        },
        {
            productType: ProductType.premiumListingsQuota,
            stripeCode: "price_1PQR61CXSPTRj2WjXMfgm3zY",
            mode: "payment"
        },
        {
            productType: ProductType.advertisementsQuota,
            stripeCode: "price_1PQR6RCXSPTRj2WjZBeXAsCJ",
            mode: "payment"
        }
    ];