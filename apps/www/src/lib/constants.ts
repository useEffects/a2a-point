import { createDirectus, rest, staticToken } from "@directus/sdk"
import { directusUrl } from "app/lib/constants"

export const nextUrl = process.env.NEXT_PUBLIC_URL
export const canUpdateToken = process.env.NODE_ENV === "production" ? process.env.DIRECTUS_RESOURCE_UPDATE_MANAGER_TOKEN! : "yz9aabx-kf6nbHHCZqOGh4wkRThfUsIE"
export const canUpdateDirectus = createDirectus(directusUrl).with(rest()).with(staticToken(canUpdateToken))
export const twilioVerifySID = process.env.TWILIO_VERIFY_SID

export const videoDemoUrl = 'https://a2apoint-misc.nyc3.digitaloceanspaces.com/app/Finalized_Out.mp4'

export const playStoreLink = "https://play.google.com/store/apps/details?id=com.a2apoint.community"
export const appStoreLink = ""
export const appVideoLink = ""