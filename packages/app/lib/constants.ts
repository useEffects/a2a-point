import Stripe from "stripe";

// export const isDevBuild = Boolean(process.env.NODE_ENV !== "production")
export const isDevBuild = true

export const directusOrigin = isDevBuild ? "dev.dashboard.a2apoint" : "dashboard.a2apoint"
export const portfolioOrigin = isDevBuild ? "dev.a2apoint" : "a2apoint"

export const directusUrl = `https://${directusOrigin}.com`;
export const directusWSUrl = `wss://${directusOrigin}.com/websocket`;
export const portfolioUrl = `https://${portfolioOrigin}.com`
export const appName = "a2apoint"
export const messagesFolderId = "4006910f-be8d-43b0-acff-7fe83ed90b43"
export const documentsFolderId = "2e080305-7ca1-4652-8903-d3deab11f5b1"
export const listingsFolderId = "3c995bad-8d9b-4330-a38a-3bad6412a853"
export const savedByMeUrl = `${directusUrl}/admin/content/listings?bookmark=6`
export const viewedByMeUrl = `${directusUrl}/admin/content/listings?bookmark=7`

export const memberRole = "d880f42a-09e6-401c-8bee-7be133b0d2fe"

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

export const phoneRegionalCode = process.env.NODE_ENV === "production" ? "AE" : "IN"