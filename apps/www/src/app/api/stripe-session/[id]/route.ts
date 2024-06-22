import stripe from "@/lib/stripe"
import { NextResponse } from "next/server"

export const GET = async (_: Request, { params }: { params: { id?: string } }) => {
    if (!params.id) return NextResponse.json({ error: "Invalid request, id missing" }, { status: 400 })

    try {
        const session = await stripe.checkout.sessions.retrieve(params.id)
        return NextResponse.json(session)
    } catch (error) {
        return NextResponse.json({ error: "Session not found" }, { status: 404 })
    }
}