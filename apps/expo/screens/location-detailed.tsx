import { Header } from "app/components/header";
import { Text } from "app/components/ui/text";
import { ScrollView, } from "app/components/utils/virtual-lists";
import { useParams } from "solito/navigation"
import { useQuery } from "@tanstack/react-query"
import directusStore from "app/store/directus";
import { readItem } from "@directus/sdk";
import { Room, User } from "app/lib/types";
import { useEffect } from "react";
import useNavigation from "app/hooks/navigation";
import { LocationDetailed as LocationDetailedComponent } from "app/screens/location-detailed"

export default function LocationDetailed() {
    const params = useParams<{ id: string }>()
    const { id } = params
    const { rest } = directusStore()
    const navigation = useNavigation()

    const { data: room } = useQuery({
        queryKey: ["Fetching full details for room", id],
        queryFn: async () => await rest.request(readItem("rooms", id, {
            fields: ["id", "title", "avatar", "members.directus_users_id.id", "members.directus_users_id.avatar"]
        })),
        enabled: Boolean(id)
    }) as {
        data: Pick<Room, "id" | "avatar" | "title"> & {
            members: {
                directus_users_id: Pick<User, "id" | "avatar">
            }[]
        }
    }

    useEffect(() => {
        if (room?.title) {
            navigation.setOptions({
                header: () => <Header>
                    <Text className="text-xl font-bold">{room.title}</Text>
                </Header>
            })
        }
    }, [room, navigation])

    if (!room) {
        return <></>
    }

    return <ScrollView>
        <LocationDetailedComponent room={room} />
    </ScrollView>
}