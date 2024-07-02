/** @jsxImportSource react */

import { Listings } from "@/components/client-components/listings";
import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { renderCardsQuery } from "app/lib/misc/queries";
import { mediumListingsFields } from "app/lib/props";

export default async function () {
    const initialData = await renderCardsQuery<MediumListingCardProps>({
        collection: "listings",
        fields: mediumListingsFields,
    })

    return <Listings data={initialData} />
}