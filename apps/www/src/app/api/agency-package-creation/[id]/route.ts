import stripe from "@/lib/stripe"
import { AgencyPackages } from "@/lib/types"
import { readItem } from "@directus/sdk"
import { portfolioUrl } from "app/lib/constants"
import directusStore from "app/store/directus"
import { NextResponse } from "next/server"

export const GET = async (req: Request, { params: { id } }: { params: { id: string } }) => {
    const { rest } = directusStore.getState()
    const agencyPackage = await rest.request(readItem("agency_packages", id)) as AgencyPackages
    if (agencyPackage.status !== "draft") return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
            {
                price_data: {
                    currency: "aed",
                    product_data: {
                        name: "Agency Package"
                    },
                    unit_amount: agencyPackage.price * 100,
                },
                quantity: 1
            }
        ],
        mode: "payment",
        success_url: `${portfolioUrl}/api/agency-package-creation/callback?session_id={CHECKOUT_SESSION_ID}`,
        metadata: {
            agencyPackageId: id
        }
    })
    return session.url ? NextResponse.redirect(session.url) : NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });
}