"use client"

import { useParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { readItem } from "@directus/sdk"
import directusStore from "app/store/directus"
import { Room, User } from "app/lib/types"
import { LocationDetailed as LocationDetailedComponent } from "app/screens/location-detailed"

export default function LocationDetailed() {
    const { id } = useParams()
    const { rest } = directusStore()

    const { data: room } = useQuery({
        queryKey: ["Fetching full details for room", id],
        queryFn: async () => await rest.request(readItem("rooms", id as string, {
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
    return room ? <div className="flex flex-col gap-4 py-4">
        <p className="text-xl font-bold px-4">{room.title}</p>
        <LocationDetailedComponent room={room} />
    </div> : <></>
}