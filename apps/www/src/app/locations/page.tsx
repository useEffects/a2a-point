/** @jsxImportSource react */

import { LocationsScreen } from "@/components/client-components/locations";
import { renderCardsQuery } from "app/lib/misc/queries";
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
    })

    return <LocationsScreen data={data} />
}