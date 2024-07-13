/** @jsxImportSource react */

import { Listings } from "@/components/client-components/listings";
import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { getListingMetrics, renderCardsQuery } from "app/lib/misc/queries";
import { mediumListingsFields } from "app/lib/props";

export default async function () {
    const initialData = await renderCardsQuery<MediumListingCardProps>({
        collection: "listings",
        fields: mediumListingsFields,
    }).then(res => Promise.all(res.map(async listing => {
        const metrics = await getListingMetrics(listing.id);
        return { ...listing, ...metrics };
    })))

    return <Listings data={initialData} />
}