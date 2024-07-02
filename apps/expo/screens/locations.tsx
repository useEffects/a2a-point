import { useRenderCardQuery } from "app/lib/misc/queries";
import { MediumLocationCardProps, mediumLocationFields } from "app/lib/props";
import { LocationsList } from "app/screens/locations-list";

export default function () {
    const { data } = useRenderCardQuery<MediumLocationCardProps>({
        collection: "rooms",
        fields: mediumLocationFields,
        filter: {
            type: {
                _eq: "group"
            }
        },
    })
    return <LocationsList data={data} />
}