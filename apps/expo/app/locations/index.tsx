import { getListingsCountForLocation, getMembersCountForLocation, renderCardsQuery } from "app/lib/misc/queries";
import { MediumLocationCardProps, mediumLocationFields } from "app/lib/props";
import { LocationsList } from "app/screens/locations-list";
import { useQuery } from "@tanstack/react-query";
import PadBottom from "../../components/pad-bottom";

export default function LocationsScreen() {
    const { data } = useQuery({
        queryKey: ["locations"],
        queryFn: async () => await renderCardsQuery<MediumLocationCardProps>({
            collection: "rooms",
            fields: mediumLocationFields,
            filter: {
                type: {
                    _eq: "group"
                }
            },
        }).then(async res => await Promise.all(res.map(async r => {
            const membersCount = await getMembersCountForLocation(r.id)
            const listingsCount = await getListingsCountForLocation(r.id)
            return { ...r, membersCount, listingsCount }
        }))),
        initialData: []
    })
    return <PadBottom>
        <LocationsList data={data} />
    </PadBottom>
}