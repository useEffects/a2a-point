import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { useRenderCardQuery } from "app/lib/misc/queries";
import { mediumListingsFields } from "app/lib/props";
import ListingsScreenComponent from "app/screens/listings";

export default function () {
    const { data } = useRenderCardQuery<MediumListingCardProps>({
        collection: "listings",
        fields: mediumListingsFields,
    })

    return <ListingsScreenComponent data={data} />
}