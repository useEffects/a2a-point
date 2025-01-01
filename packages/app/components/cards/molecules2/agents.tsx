import { Query } from "@directus/sdk"
import { queryFnType } from "app/components/infinite"
import { memberRole } from "app/lib/constants"
import { getFeedbacksCountForUser, getListingsCountForUser, renderCardsQuery2 } from "app/lib/misc/queries"
import { MediumUsersCardProps, mediumUsersFields, UsersCardMetrics } from "app/lib/props"
import { merge } from "lodash"

export const mediumUsersCardsQuery: queryFnType<MediumUsersCardProps & UsersCardMetrics> = async (apiOptions) => {
    const res = await renderCardsQuery2<MediumUsersCardProps>({
        collection: "users",
        ...apiOptions,
    }).then(res => Promise.all(res.map(async r => {
        const listingsCount = await getListingsCountForUser(r.id)
        const ratingsCount = await getFeedbacksCountForUser(r.id)
        return { ...r, listingsCount, ratingsCount } as MediumUsersCardProps & UsersCardMetrics
    })))

    return res
}

export const getMediumUsersCardArgs = (apiOptions: Query<any, MediumUsersCardProps>): Query<any, MediumUsersCardProps & UsersCardMetrics> => {
    return merge({
        fields: mediumUsersFields,
        filter: {
            role: {
                _eq: memberRole
            }
        }
    }, apiOptions)
}