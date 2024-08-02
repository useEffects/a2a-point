import { canUpdateDirectus } from "@/lib/constants"
import { createItem, readItem, readItems } from "@directus/sdk"
import { error } from "console"
import { NextResponse } from "next/server"

export const POST = async (req: Request) => {
    const { email } = await req.json()
    const res = await canUpdateDirectus.request(createItem("news_letter_subscribers", {
        email
    }))
    return NextResponse.json(res)
}

export const GET = async (req: Request) => {
    const url = new URL(req.url)
    const email = url.searchParams.get("email")
    if (!email) {
        return NextResponse.json("Email is required", { status: 400 })
    }

    const res = await canUpdateDirectus.request(readItems("news_letter_subscribers", {
        filter: {
            email: {
                _eq: email
            }
        }
    }))

    return NextResponse.json(res)

}