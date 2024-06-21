import { twilioVerifySID } from "@/lib/constants";
import { twilio } from "@/lib/twilio";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const body = await req.json() as { phone: string, channel?: string };
    const verification = await twilio.verify.v2.services(twilioVerifySID!)
        .verifications
        .create({ to: body.phone, channel: body.channel ?? "sms" })
    return verification ? new NextResponse(null, { status: 204 }) : new NextResponse(null, { status: 500 })
}