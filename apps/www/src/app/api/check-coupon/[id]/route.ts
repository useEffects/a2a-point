import stripe from "@/lib/stripe"
import { NextResponse } from "next/server";

export const GET = async (req: Request, { params: { id } }: { params: { id: string } }) => {
    try {
        const res = await stripe.coupons.retrieve(id)
        return (res && res.valid) ? NextResponse.json({ valid: true }) : NextResponse.error();
    } catch (error) {
        console.log(error)
        return NextResponse.error();
    }
}