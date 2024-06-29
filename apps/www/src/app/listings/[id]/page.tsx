/** @jsxImportSource react */

import { fetchAllData } from "@/lib/helpers"
import { ListingDetailedScreen } from "@/screens/listings"
import { readItem } from "@directus/sdk"
import { fullListingCardFields, FullListingDetailedProps } from "app/lib/props"
import directusStore from "app/store/directus"
import { queryClient } from "app/store/query"

export const revalidate = 60

export default async function ({ params }: { params: { id: string } }) {
    const { id } = params
    const { rest } = directusStore.getState()

    const listing = await queryClient.fetchQuery({
        queryKey: ["Fetch listing for detailed screen", id],
        queryFn: async () => await rest.request(readItem("listings", id, {
            fields: fullListingCardFields
        })) as FullListingDetailedProps,
    })

    return <ListingDetailedScreen listing={listing} />
}

export async function generateStaticParams() {
    return fetchAllData<{ id: string }>("listings", {}, ["id"])
}