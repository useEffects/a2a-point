import { twilioVerifySID } from "@/lib/constants";
import { twilio } from "@/lib/twilio";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const body = await req.json() as { phone: string, code: string };
    const verificationCheck = await twilio.verify.v2.services(twilioVerifySID!)
        .verificationChecks
        .create({ to: body.phone, code: body.code })
    return NextResponse.json({ status: verificationCheck.status })
}