import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { getListingMetrics, renderCardsQuery } from "app/lib/misc/queries";
import { mediumListingsFields } from "app/lib/props";
import ListingsScreenComponent from "app/screens/listings";
import { useQuery } from "@tanstack/react-query";

export default function () {
    const { data } = useQuery({
        queryKey: ["Listings page medium cards"],
        queryFn: async () => await renderCardsQuery<MediumListingCardProps>({
            collection: "listings",
            fields: mediumListingsFields,
            limit: 30,
        }).then(res => Promise.all(res.map(async listing => {
            const metrics = await getListingMetrics(listing.id)
            return { ...listing, ...metrics }
        }))),
        initialData: [],
    })

    return <ListingsScreenComponent data={data} />
}