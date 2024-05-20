import directusStore from "app/store/directus"
import { aggregate } from "@directus/sdk"

export const getListingsCountForUser = async (userId: string) => {
    const { rest } = directusStore.getState()
    const getListingsCount = await rest.request(aggregate("listings", {
        aggregate: {
            count: ["*"]
        },
        query: {
            filter: {
               user_created: {
                     _eq: userId
               }
            }
        }
    }))
    return getListingsCount?.[0]!.count as unknown as number
}