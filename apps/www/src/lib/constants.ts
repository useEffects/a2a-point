import { token } from "app/store/directus"

export const directusUrl = "https://dashboard.a2apoint.com"
export const nextUrl = process.env.NEXT_PUBLIC_URL
export const directusToken = token
export const basicPlanStripeCodes = {
    monthly: "price_1POIoQCXSPTRj2Wj7dkgRn4d",
    yearly: "price_1POIyzCXSPTRj2WjdgbDZYge"
}
export const proPlanStripeCodes = {
    monthly: "price_1POIxACXSPTRj2WjrlgGAnro",
    yearly: "price_1POJ0TCXSPTRj2WjszJgywln"
}