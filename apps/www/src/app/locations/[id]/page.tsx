/** @jsxImportSource react */

import { fetchAllData } from "@/lib/helpers"
import { LocationDetailedScreen } from "@/screens/location"
import { readItem } from "@directus/sdk"
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
    return data ? <div className="flex flex-col gap-4 py-4">
        <p className="text-xl font-bold px-4">{data.title}</p>
        <LocationDetailedScreen room={data} />
    </div> : <></>
}

export async function generateStaticParams() {
    return fetchAllData<{ id: string }>("rooms", {
        type: {
            _eq: "group"
        }
    }, ["id"])
}