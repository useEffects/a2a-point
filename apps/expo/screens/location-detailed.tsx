import { readItem } from "@directus/sdk";
import { useQuery } from "@tanstack/react-query";
import { getMembersCountForLocation } from "app/lib/misc/queries";
import { LocationDetailed as LocationDetailedComponent, LocationDetailedProps } from "app/screens/location-detailed";
import directusStore from "app/store/directus";
import { useParams } from "solito/navigation";

export default function LocationDetailed() {
    const params = useParams<{ id?: string }>()
    const { id } = params
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

    return (room && (totalMembers !== undefined && totalMembers !== null)) ? <LocationDetailedComponent room={room} totalMembers={totalMembers} /> : <></>
}