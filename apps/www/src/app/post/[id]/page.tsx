"use client"

import directusStore from "app/store/directus"
import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { Listing } from "app/lib/types"
import { readItem } from "@directus/sdk"

export default function PostEditPage() {
    const { id } = useParams()
    const { rest } = directusStore()

    const { data: listing } = useQuery<Listing>({
        queryKey: ["listing", id],
        queryFn: async () => await rest.request(readItem("listings", id as string, {
            fields: ["*"]
        })) as Listing,
        enabled: typeof id === "string"
    })

    console.log(id)

    if (!listing) return null
    console.log(listing)
    return <></>

}