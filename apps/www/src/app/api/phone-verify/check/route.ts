import { canUpdateToken, twilioVerifySID } from "@/lib/constants";
import { twilio } from "@/lib/twilio";
import { directusUrl } from "app/lib/constants";
import axios from "axios";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
    const body = await req.json() as { phone: string, code: string, user: string };
    const verificationCheck = await twilio.verify.v2.services(twilioVerifySID!)
        .verificationChecks
        .create({ to: body.phone, code: body.code })

    if (verificationCheck.status === "approved") {
        await axios.patch(`${directusUrl}/users/${body.user}`, { phone: body.phone }, {
            headers: {
                Authorization: `Bearer ${canUpdateToken}`
            }
        })
    }

    return NextResponse.json({ status: verificationCheck.status })
}