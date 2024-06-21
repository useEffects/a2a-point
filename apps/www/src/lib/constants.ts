import { createDirectus, rest, staticToken } from "@directus/sdk"
import Stripe from "stripe"

export const directusUrl = "https://dashboard.a2apoint.com"
export const nextUrl = process.env.NEXT_PUBLIC_URL
export const canUpdateToken = "ln_N8JIY7VkTZzD-6H0tJsv8FMc39OBf"
export const canUpdateDirectus = createDirectus(directusUrl).with(rest()).with(staticToken(canUpdateToken))
export const twilioVerifySID = process.env.TWILIO_VERIFY_SID