"use client"

import { useParams } from "next/navigation"
import ListingDetailed from "app/screens/listing-detailed"
import { queryClient } from "app/store/query"
import directusStore from "app/store/directus"
import { readItems } from "@directus/sdk"

export default function ListingsPage() {
    const { id } = useParams()
    return id ? <div className="max-w-xl">
        <ListingDetailed listingId={id as string} />
    </div> : <></>
}

export async function generateStaticParams() {
    const { rest } = directusStore.getState()
    const data = await queryClient.fetchQuery({
        queryKey: ["listings static params"],
        queryFn: async () => await rest.request(readItems("listings", {
            fields: ["id"]
        }))
    })
    return data
}