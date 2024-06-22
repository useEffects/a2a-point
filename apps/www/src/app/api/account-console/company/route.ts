import { canUpdateToken } from "@/lib/constants"
import { directusUrl } from "app/lib/constants"
import axios from "axios"
import { NextResponse } from "next/server"

export const PATCH = async (req: Request) => {
    const body = await req.json() as { user: string, company: string }
    const res = await axios.patch(`${directusUrl}/users/${body.user}`, { company: body.company }, {
        headers: {
            Authorization: `Bearer ${canUpdateToken}`
        }
    })
    return NextResponse.json(res.data, { status: res.status })
}