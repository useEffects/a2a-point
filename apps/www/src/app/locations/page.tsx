/** @jsxImportSource react */

import { LocationsScreen } from "@/components/client-components/locations";
import { getListingMetrics, getListingsCountForLocation, getMembersCountForLocation, renderCardsQuery } from "app/lib/misc/queries";
import { MediumLocationCardProps, mediumLocationFields } from "app/lib/props";

export default async function () {
    const data = await renderCardsQuery<MediumLocationCardProps>({
        collection: "rooms",
        fields: mediumLocationFields,
        filter: {
            type: {
                _eq: "group"
            }
        }
    }).then(res => Promise.all(res.map(async location => {
        const membersCount = await getMembersCountForLocation(location.id)
        const listingsCount = await getListingsCountForLocation(location.id)
        return { ...location, membersCount, listingsCount }
    })))

    return <LocationsScreen data={data} />
}