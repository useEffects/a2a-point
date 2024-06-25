import { createDirectus, rest, staticToken } from "@directus/sdk"
import { directusUrl } from "app/lib/constants"

export const nextUrl = process.env.NEXT_PUBLIC_URL
export const canUpdateToken = "yz9aabx-kf6nbHHCZqOGh4wkRThfUsIE"
export const canUpdateDirectus = createDirectus(directusUrl).with(rest()).with(staticToken(canUpdateToken))
export const twilioVerifySID = process.env.TWILIO_VERIFY_SID