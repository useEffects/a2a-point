import { NextResponse } from "next/server";
import stripe from "@/lib/stripe";
import { portfolioUrl } from "app/lib/constants";

export const GET = async (req: Request, { params }: { params: { product?: string } }) => {
    const { product } = params
    if (!product) {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const reqUrl = new URL(req.url)
    const redirectUrl = reqUrl.searchParams.get('redirect')
    const mode = reqUrl.searchParams.get('mode') ?? "payment"

    if (mode !== "payment" && mode !== "subscription") {
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    try {
        const price = await stripe.prices.retrieve(product);
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
            mode: mode,
            success_url: `${portfolioUrl}/${redirectUrl}`,
            cancel_url: `${portfolioUrl}/membership`,
        });
        return session.url ? NextResponse.redirect(session.url) : NextResponse.json({ error: "Failed to initiate payment" }, { status: 500 });

    } catch (err: any) {
        console.error('Error initiating payment:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}