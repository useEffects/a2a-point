import { aggregate, createItem, createNotification, deleteItems, readItems } from "@directus/sdk"
import { useQuery } from "@tanstack/react-query"
import directusStore from "~/store/directus"
import { queryClient } from ".."
import userStore from "~/store/user"
import { Listing, User } from "~/types"
import { directusUrl } from "~/lib/constants"

const viewsCountKey = (listingId: string) => ["views-count", listingId]
const savesCountKey = (listingId: string) => ["saves-count", listingId]
const checkSavesKey = (listingId: string) => ["check-saved", listingId]

export type UserCount = { count: { directus_users_id: string } }

export const useListingMetrics = (listingId: string) => {
    const { rest } = directusStore()
    const { user } = userStore()

    const { data: viewsRes } = useQuery({
        queryKey: viewsCountKey(listingId),
        queryFn: async () => await rest.request(aggregate("listings_directus_users_1", {
            aggregate: {
                count: ["directus_users_id"],
            },
            query: {
                filter: {
                    listings_id: {
                        _eq: listingId
                    }
                }
            }
        }))
    })

    const { data: savesRes } = useQuery({
        queryKey: savesCountKey(listingId),
        queryFn: async () => await rest.request(aggregate("listings_directus_users", {
            aggregate: {
                count: ["directus_users_id"],
            },
            query: {
                filter: {
                    listings_id: {
                        _eq: listingId
                    }
                }
            }
        }))
    })

    const { data: checkSavedRes } = useQuery({
        queryKey: ["check-saved", listingId],
        queryFn: async () => await rest.request(readItems("listings_directus_users", {
            filter: {
                listings_id: {
                    _eq: listingId
                },
                directus_users_id: {
                    _eq: user.id
                }
            },
            fields: ["id"]
        }))
    })

    const deleteBookmark = async (listingId: string, savedId: string) => {
        await queryClient.fetchQuery({
            queryKey: ["delete-listing", savedId],
            queryFn: async () => await rest.request(deleteItems("listings_directus_users", [savedId]))
        })
        queryClient.setQueryData(savesCountKey(listingId), ([prev]: UserCount[]
        ) => { return [{ count: { directus_users_id: (Number(prev.count.directus_users_id) - 1) } }] })
        queryClient.setQueryData(checkSavesKey(listingId), [])
    }

    const addBookmark = async (listing: Pick<Listing, "id" | "title">, recipient: Pick<User, "email" | "id">) => {
        const { id: listingId, title } = listing
        const res = await queryClient.fetchQuery({
            queryKey: ["save-listing", listingId],
            queryFn: async () => await rest.request(createItem("listings_directus_users", {
                listings_id: listingId,
                directus_users_id: user.id
            }))
        })
        await queryClient.fetchQuery({
            queryKey: ["Send notification for bookmark", listingId],
            queryFn: async () => await rest.request(createNotification({
                collection: "listings",
                item: listingId,
                message: `You have a new bookmark on your listing ${title} from ${user.email}`,
                recipient: recipient.id,
                sender: user.id,
                subject: "New Bookmark Received!",
                type: "user",
                related_user: user.id
            }))
        })
        await queryClient.setQueryData(savesCountKey(listingId), ([prev]: UserCount[]
        ) => ([{ count: { directus_users_id: (Number(prev.count.directus_users_id) + 1) } }]))
        await queryClient.setQueryData(checkSavesKey(listingId), [{ id: res.id }])
        return res
    }

    return {
        views: (viewsRes && viewsRes.length) ? viewsRes[0].count["directus_users_id"] : undefined,
        saves: (savesRes && savesRes.length) ? savesRes[0].count["directus_users_id"] : undefined,
        deleteBookmark,
        addBookmark,
        bookmarkId: (checkSavedRes && checkSavedRes.length) ? checkSavedRes[0].id : undefined
    }
}