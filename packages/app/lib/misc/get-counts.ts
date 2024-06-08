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

export const getFeedbacksCountForUser = async (userId: string) => {
    const { rest } = directusStore.getState()
    const getFeedbacksCount = await rest.request(aggregate("feedbacks", {
        aggregate: {
            count: ["*"]
        },
        query: {
            filter: {
                agent: {
                    _eq: userId
                }
            }
        }
    }))
    return getFeedbacksCount?.[0]!.count as unknown as number
}

export const getListingsCount = async () => {
    const { rest } = directusStore.getState()
    const getListingsCount = await rest.request(aggregate("listings", {
        aggregate: {
            count: ["*"]
        },
    }))
    return getListingsCount?.[0]!.count as unknown as number
}