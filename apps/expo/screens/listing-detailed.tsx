import { useParams } from "solito/navigation"
import ListingDetailed from "app/screens/listing-detailed"
import { useQuery } from "@tanstack/react-query"
import directusStore from "app/store/directus"
import { readItem } from "@directus/sdk"
import { fullListingCardFields, FullListingDetailedProps } from "app/lib/props"

export default function ListingDetailedScreen() {
    const { id } = useParams()
    const { rest } = directusStore()

    const { data } = useQuery({
        queryKey: ["ListingDetailed", id],
        queryFn: async () => await rest.request(readItem("listings", id! as string, {
            fields: fullListingCardFields
        })) as FullListingDetailedProps,
        enabled: !!id
    })

    return data ? <ListingDetailed listing={data} /> : <></>
}