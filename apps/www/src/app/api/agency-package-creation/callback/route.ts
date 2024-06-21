import { canUpdateDirectus } from "@/lib/constants"
import stripe from "@/lib/stripe"
import { AgencyPackages } from "@/lib/types"
import { readItem, updateItem } from "@directus/sdk"
import { directusUrl, ProductType, products } from "app/lib/constants"
import directusStore from "app/store/directus"
import { NextResponse } from "next/server"

export const GET = async (req: Request) => {
    const { rest } = directusStore.getState()
    const url = new URL(req.url)
    const session_id = url.searchParams.get("session_id")
    if (!session_id) return NextResponse.json({ error: "Invalid request" }, { status: 400 })
    const session = await stripe.checkout.sessions.retrieve(session_id)
    const { metadata } = session
    if (metadata) {
        const { agencyPackageId } = metadata
        const agencyPackage = await rest.request(readItem("agency_packages", agencyPackageId)) as AgencyPackages
        const coupons = Array.from({ length: agencyPackage.members_count }).map(() => stripe.coupons.create({
            percent_off: agencyPackage.discount,
            duration: "forever",
            applies_to: {
                products: products.filter(p => {
                    switch (p.productType) {
                        case ProductType.basicPlanMonthly:
                        case ProductType.basicPlanYearly:
                        case ProductType.proPlanMonthly:
                        case ProductType.proPlanYearly:
                            return true;
                    }
                }).map(p => p.productId!),
            },
            metadata: {
                agencyPackageId: agencyPackageId
            },
        }))
        const resolvedCoupons = await Promise.all(coupons)
        await canUpdateDirectus.request(updateItem("agency_packages", agencyPackageId, {
            status: "published",
            coupons: resolvedCoupons.map(c => ({
                code: c.id
            }))
        }))
        return NextResponse.redirect(`${directusUrl}/admin/content/companies/${agencyPackage.company}`)
    } else {
        return NextResponse.json({ error: "No metadata found, contact admin immediately" }, { status: 500 })
    }
}