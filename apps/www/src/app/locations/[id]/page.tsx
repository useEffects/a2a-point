/** @jsxImportSource react */

import { fetchAllData } from "@/lib/helpers"
import { LocationDetailedScreen } from "@/screens/location"
import { readItem } from "@directus/sdk"
import { MediumListingCardProps } from "app/components/cards/atoms/medium"
import { getListingMetrics, getMembersCountForLocation, renderCardsQuery } from "app/lib/misc/queries"
import { mediumListingsFields } from "app/lib/props"
import { LocationListingProps } from "app/screens/location-detailed"
import directusStore from "app/store/directus"
import { queryClient } from "app/store/query"

export const revalidate = 60

export default async function ({ params }: { params: { id: string } }) {
    const { id } = params
    const { rest } = directusStore.getState()

    const data = await queryClient.fetchQuery<LocationListingProps>({
        queryKey: ["Fetch locations data", id],
        queryFn: async () => await rest.request(readItem("rooms", id, {
            fields: ["id", "title", "avatar", "members.directus_users_id.id", "members.directus_users_id.avatar"]
        })) as Promise<LocationListingProps>
    })

    const totalMembersForLocation = await getMembersCountForLocation(id)

    const listings = await renderCardsQuery<MediumListingCardProps>({
        collection: "listings",
        fields: mediumListingsFields,
        filter: {
            location: {
                _eq: id
            }
        }
    }).then(res => Promise.all(res.map(async listing => {
        const metrics = await getListingMetrics(listing.id)
        return { ...listing, ...metrics }
    })))

    return data ? <div className="w-full">
        <LocationDetailedScreen room={data} totalMembers={totalMembersForLocation} listings={listings} />
    </div> : <></>
}

export async function generateStaticParams() {
    return fetchAllData<{ id: string }>("rooms", {
        type: {
            _eq: "group"
        }
    }, ["id"])
}