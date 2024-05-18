import { directus } from "@/lib/directus"
import { readItems } from "@directus/sdk"

export const GET = async (req: Request) => {
    const searchParams = new URL(req.url).searchParams
    const fields = JSON.parse(searchParams.get("fields") ?? JSON.stringify(["*"]))
    const filter = JSON.parse(searchParams.get("filter") ?? JSON.stringify({}))
    const search = JSON.parse(searchParams.get("search") ?? JSON.stringify(""))
    const sort = JSON.parse(searchParams.get("sort") ?? JSON.stringify(["-date_created"]))
    const limit = JSON.parse(searchParams.get("limit") ?? JSON.stringify(20))

    const res = await directus.request(readItems("advertisements", {
        fields,
        filter,
        search,
        sort,
        limit: Math.min(limit, 20),
    }))
    return new Response(JSON.stringify(res), { status: 200 })
}