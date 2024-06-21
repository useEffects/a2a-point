import { canUpdateDirectus, canUpdateToken } from "@/lib/constants"
import stripe from "@/lib/stripe"
import { Coupon } from "@/lib/types"
import { readItem, readItems, updateItem } from "@directus/sdk"
import { ProductType, directusUrl, portfolioUrl, products } from "app/lib/constants"
import directusStore from "app/store/directus"
import { NextResponse } from "next/server"
import Stripe from "stripe"

const updateQuota = async (user_id: string, productType: ProductType.premiumListingsQuota | ProductType.advertisementsQuota) => {
    const { token } = directusStore.getState()
    const fieldToUpdate = productType === ProductType.premiumListingsQuota ? "premium_quota" : "ads_quota"

    const initialValue = await fetch(`${directusUrl}/users/${user_id}/?fields=${fieldToUpdate}`, {
        headers: {
            "Authorization": `Bearer ${token}`
        }
    }).then(res => res.json()).then(res => res.data)

    const res = await fetch(`${directusUrl}/users/${user_id}/?fields=${fieldToUpdate}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${canUpdateToken}`
        },
        body: JSON.stringify({
            [fieldToUpdate]: initialValue[fieldToUpdate] + 5
        })
    }).then(res => res.json()).then(res => res.data)

    return res[fieldToUpdate] === initialValue[fieldToUpdate] + 5
}

const updatePlans = async (user_id: string, productType: ProductType.basicPlanMonthly | ProductType.basicPlanYearly | ProductType.proPlanMonthly | ProductType.proPlanYearly, agencyPackageId: string, coupon: string) => {
    if (agencyPackageId && coupon) {
        const { coupons: existingCoupons, company } = await canUpdateDirectus.request(readItem("agency_packages", agencyPackageId, {
            fields: ["coupons.*", "company.members", "company.id"]
        })) as { coupons: Coupon[], company: { members: string[], id: string } }
        const updatedCoupons = existingCoupons.map(c => c.code === coupon ? ({
            ...c,
            status: "published",
            agent_used: user_id
        }) : c)
        await canUpdateDirectus.request(updateItem("agency_packages", agencyPackageId, {
            coupons: updatedCoupons
        }))
        await canUpdateDirectus.request(updateItem("companies", company.id, {
            members: [...company.members, user_id]
        }))
    }

    const res = await fetch(`${directusUrl}/users/${user_id}/?fields=plan`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${canUpdateToken}`
        },
        body: JSON.stringify({
            plan: productType
        })
    }).then(res => res.json()).then(res => res.data)
    return res.plan === productType
}

export const GET = async (req: Request) => {
    const url = new URL(req.url)
    const session_id = url.searchParams.get("session_id")
    if (!session_id) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    const session = await stripe.checkout.sessions.retrieve(session_id)
    const { metadata } = session
    const success = await handleCallback(metadata)

    return NextResponse.redirect(`${portfolioUrl}/callback?session_id=${session_id}&success=${success}`)
}

const handleCallback = async (metadata: Stripe.Metadata | null) => {
    if (!metadata) return false
    const { userId, priceCode, agencyPackageId, coupon } = metadata
    const productType = products.find(p => p.stripeCode === priceCode)!.productType

    switch (productType) {
        case ProductType.premiumListingsQuota:
        case ProductType.advertisementsQuota:
            return await updateQuota(userId, productType)
        default:
            return await updatePlans(userId, productType, agencyPackageId, coupon)
    }

}