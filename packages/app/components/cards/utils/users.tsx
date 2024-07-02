import { memberRole } from "app/lib/constants"
import { useRenderCardQuery } from "app/lib/misc/queries"
import { MediumUsersCardProps, mediumUsersFields, SmallUsersCardProps, smallUsersFields } from "app/lib/props"

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

export const useMediumUsersQuery = () => {
    return useRenderCardQuery<MediumUsersCardProps>({
        collection: "users",
        fields: mediumUsersFields,
        filter: {
            role: {
                _eq: memberRole
            }
        },
    })
}