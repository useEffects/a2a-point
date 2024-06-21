import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { portfolioUrl, products } from "app/lib/constants";

export const GET = async (req: Request, { params }: { params: { product?: string } }) => {
    const { searchParams } = new URL(req.url)
    const { product } = params

    if (!product) return NextResponse.json({ error: "Invalid request, product missing" }, { status: 400 })

    const user_id = searchParams.get("user_id")
    if (!user_id) return NextResponse.json({ error: "Invalid request, user_id missing" }, { status: 400 })

    const foundProduct = products.find(p => p.stripeCode === product)
    if (!foundProduct) return NextResponse.json({ error: "Invalid request" }, { status: 400 })

    const coupon = searchParams.get("coupon")
    let isCouponValid = false
    let agencyPackageId = ""
    if (coupon) {
        const retrievedCoupon = await stripe.coupons.retrieve(coupon)
        if (retrievedCoupon && retrievedCoupon.valid) {
            isCouponValid = true
            if (retrievedCoupon.metadata?.agencyPackageId) {
                agencyPackageId = retrievedCoupon.metadata?.agencyPackageId
            }
        }
    }

    try {
        const price = await stripe.prices.retrieve(product ?? "");
        if (!price) {
            return NextResponse.json({ error: "Product not found", status: 404 })
        }
    } catch (error: any) {
        return NextResponse.json({ error: "Product not found", status: 404 })
    }

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: product,
                    quantity: 1,
                }
            ],
            mode: foundProduct.mode,
            success_url: `${portfolioUrl}/api/pay/callback?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${portfolioUrl}/membership`,
            metadata: {
                userId: user_id,
                priceCode: product,
                agencyPackageId: agencyPackageId,
                coupon: isCouponValid ? coupon : ""
            },
            discounts: isCouponValid ? [{
                coupon: coupon!
            }] : undefined
        });
        return session.url ? NextResponse.redirect(session.url) : NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });

    } catch (err: any) {
        console.error('Error initiating payment:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}