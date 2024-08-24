import { readItem } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { MediumListingCardProps } from "app/components/cards/atoms/medium";
import { CommonFilters, commonFilters } from "app/components/cards/molecules/listings";
import { getListingMetrics, getMembersCountForLocation, renderCardsQuery, useRenderCardQuery } from "app/lib/misc/queries";
import { ListingCardMetrics, mediumListingsFields } from "app/lib/props";
import { LocationDetailed as LocationDetailedComponent, LocationDetailedProps } from "app/screens/location-detailed";
import directusStore from "app/store/directus";
import { useParams } from "solito/navigation";
import PadBottom from "../../components/pad-bottom";
import { View } from "react-native";

export default function LocationSlug() {
    const params = useParams<{ slug?: string[] }>()
    const { slug } = params
    const [id, ...rest] = slug!

    return rest.join("") === "members" ? <MembersScreen id={id!} /> : <LocationDetailedScreen id={id!} />
}

const LocationDetailedScreen = ({ id }: { id: string }) => {

    const { rest } = directusStore()
    const { data: room } = useQuery({
        queryKey: ["LocationDetailed", id],
        queryFn: async () => await rest.request(readItem("rooms", id!, {
            fields: ["*", "members.*.directus_users_id.id", "members.*.directus_users_id.avatar"],
            filter: {
                type: {
                    _eq: "group"
                }
            },
            deep: {
                members: {
                    _limit: 10,
                }
            }
        })) as LocationDetailedProps["room"],
        enabled: !!id
    })

    const { data: totalMembers } = useQuery({
        queryKey: ["LocationDetailed", id, "totalMembers"],
        queryFn: async () => getMembersCountForLocation(id!),
        enabled: !!id
    })

    const { data: listings } = useQuery<(MediumListingCardProps & ListingCardMetrics)[]>({
        queryKey: ["location detailed listings", id],
        queryFn: async () => await renderCardsQuery<MediumListingCardProps>({
            collection: "listings",
            fields: mediumListingsFields,
            filter: commonFilters[CommonFilters.GroupId](id!),
        }).then(res => Promise.all(res.map(async res => {
            const metrics = await getListingMetrics(res.id)
            return { ...res, ...metrics }
        }))),
        initialData: []
    })

    return (room && (totalMembers !== undefined && totalMembers !== null)) ?
        <PadBottom>
            <LocationDetailedComponent
                room={room}
                totalMembers={totalMembers}
                listings={listings}
            />
        </PadBottom> : <></>
}

const MembersScreen = ({ id }: { id: string }) => {
    return <View>

    </View>
}