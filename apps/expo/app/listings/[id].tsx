import { useParams } from "solito/navigation"
import ListingDetailed from "app/screens/listing-detailed"
import { useQuery } from "@tanstack/react-query"
import directusStore from "app/store/directus"
import { readItem } from "@directus/sdk"
import { fullListingCardFields, FullListingDetailedProps } from "app/lib/props"
import { getFeedbacksCountForUser, getListingMetrics, getListingsCountForUser } from "app/lib/misc/queries"

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

    const { data: metrics } = useQuery({
        queryKey: ["ListingMetrics", id],
        queryFn: async () => await getListingMetrics(id! as string),
        enabled: !!id,
    })

    const { data: usersMetrics } = useQuery({
        queryKey: ["UserMetrics", id],
        queryFn: async () => Promise.all([getListingsCountForUser(data!.user_created.id), getFeedbacksCountForUser(data!.user_created.id)]),
        enabled: !!data,
    })

    return (data && metrics && usersMetrics) ? <ListingDetailed listing={{
        ...data,
        ...metrics,
        listingsCount: usersMetrics![0],
        ratingsCount: usersMetrics![1]
    }} /> : <></>
}