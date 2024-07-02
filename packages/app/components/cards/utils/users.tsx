import { memberRole } from "app/lib/constants"
import { useRenderCardQuery } from "app/lib/misc/queries"
import { SmallUsersCardProps, smallUsersFields } from "app/lib/props"

export const useSmallUsersQuery = () => {
    return useRenderCardQuery<SmallUsersCardProps>({
        collection: "users",
        fields: smallUsersFields,
        filter: {
            role: {
                _eq: memberRole
            }
        },
    })
}