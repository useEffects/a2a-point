import { useQuery } from "@tanstack/react-query"
import { memberRole } from "app/lib/constants"
import { getFeedbacksCountForUser, getListingsCountForUser, renderCardsQuery, useRenderCardQuery } from "app/lib/misc/queries"
import { MediumUsersCardProps, mediumUsersFields, SmallUsersCardProps, smallUsersFields } from "app/lib/props"

export const useSmallUsersQuery = () => {
    return useQuery({
        queryKey: ["Fetch small users"],
        queryFn: async () => await renderCardsQuery<SmallUsersCardProps>({
            collection: "users",
            fields: smallUsersFields,
            filter: {
                role: {
                    _eq: memberRole
                }
            },
            limit: 5
        }).then(res => Promise.all(res.map(async user => {
            const listingsCount = await getListingsCountForUser(user.id)
            const ratingsCount = await getFeedbacksCountForUser(user.id)
            return { ...user, listingsCount, ratingsCount }
        }))),
        initialData: [],
        refetchOnMount: "always"
    })
}

export const useMediumUsersQuery = () => {
    return useQuery({
        queryKey: ["Fetch medium users"],
        queryFn: async () => await renderCardsQuery<MediumUsersCardProps>({
            collection: "users",
            fields: mediumUsersFields,
            filter: {
                role: {
                    _eq: memberRole
                }
            },
            limit: 5
        }).then(res => Promise.all(res.map(async user => {
            const listingsCount = await getListingsCountForUser(user.id)
            const ratingsCount = await getFeedbacksCountForUser(user.id)
            return { ...user, listingsCount, ratingsCount }
        }))),
        initialData: [],
    })
}