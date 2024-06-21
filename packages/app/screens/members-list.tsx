import { readItem } from "@directus/sdk"
import { MediumUsersCardProps, mediumUsersFields } from "app/components/cards/atoms/users"
import { Mode, RenderUsers } from "app/components/cards/molecules/users"
import directusStore from "app/store/directus"
import { useEffect, useState } from "react"

export const MembersListScreenComponent = ({ locationId }: { locationId: string }) => {
    const [members, setMembers] = useState<MediumUsersCardProps[]>([])
    const { rest } = directusStore()

    useEffect(() => {
        async function fetchMembers() {
            const res = await rest.request(readItem("rooms", locationId, {
                fields: mediumUsersFields.map(f => `members.directus_users_id.${f}`),
                join: ["rooms_directus_users.users_id"]
            })) as {
                members: {
                    directus_users_id: MediumUsersCardProps
                }[]
            }
            setMembers(res.members.map(m => m.directus_users_id))
        }
        fetchMembers()
    }, [])

    return <RenderUsers<MediumUsersCardProps>
        mode={Mode.medium}
        flatListProps={{
            contentContainerClassName: "p-4"
        }}
    />
}