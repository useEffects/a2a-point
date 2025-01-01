import { Query } from "@directus/sdk"
import { queryFnType } from "app/components/infinite"
import { getListingsCountForLocation, getMembersCountForLocation, renderCardsQuery, renderCardsQuery2 } from "app/lib/misc/queries"
import { LocationCardMetrics, MediumLocationCardProps, mediumLocationFields } from "app/lib/props"
import { merge } from "lodash"

export const mediumLocationCardsQuery: queryFnType<MediumLocationCardProps & LocationCardMetrics> = async (apiOptions) => {
    const res = await renderCardsQuery2<MediumLocationCardProps>({
        collection: "rooms",
        ...apiOptions,
    }).then(res => Promise.all(res.map(async r => {
        const listingsCount = await getListingsCountForLocation(r.id)
        const membersCount = await getMembersCountForLocation(r.id)
        return { ...r, listingsCount, membersCount } as MediumLocationCardProps & LocationCardMetrics
    })))

    return res
}

export const getMediumLocationQueryArgs = (apiOptions: Query<any, MediumLocationCardProps>): Query<any, MediumLocationCardProps & LocationCardMetrics> => {
    return merge({
        fields: mediumLocationFields,
        filter: {
            type: {
                _eq: "group"
            }
        },
        deep: {
            members: {
                _limit: 5,
            }
        }
    }, apiOptions)
}