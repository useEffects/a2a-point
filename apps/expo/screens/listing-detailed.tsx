import { createItem, readItem, readItems } from "@directus/sdk"
import { FullListingCard, FullListingCardFields, FullListingDetailed } from "app/components/cards/atoms/full"
import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { LoginPopover } from "app/screens/listings"
import directusStore from "app/store/directus"
import { queryClient } from "app/store/query"
import userStore from "app/store/user"
import { useEffect, useState } from "react"
import { ScrollView, View } from "react-native"
import { useParams } from "solito/navigation"

export default function FullListingScreen() {
    const { rest, authenticated } = directusStore()
    const { user } = userStore()
    const params = useParams<{ id: string }>()
    const [listing, setListing] = useState<FullListingDetailed | null>(null)

    useEffect(() => {
        if (params.id) {
            rest.request(readItem("listings", params.id, {
                fields: FullListingCardFields
            })).then(res => setListing(res as FullListingDetailed))
        }

    }, [params, rest])

    useEffect(() => {
        if (!params.id || !listing || !authenticated) return
        async function addViewCount() {
            try {
                const viewedBy = await queryClient.fetchQuery({
                    queryKey: ["listings_directus_users_1", params.id, user.id, "viewed_by"],
                    queryFn: async () => await rest.request(readItems("listings_directus_users_1", {
                        filter: {
                            listings_id: {
                                _eq: params.id
                            },
                            directus_users_id: {
                                _eq: user.id
                            }
                        }
                    }))
                })
                if (!viewedBy?.length) {
                    await rest.request(createItem("listings_directus_users_1", {
                        listings_id: params.id,
                        directus_users_id: user.id
                    }))
                }
            } catch (error) {
                console.log("Error in full listing card", error)
            }
        }
        addViewCount()
    }, [params.id, rest, user.id, listing, authenticated])

    return listing ? <ScrollView className="flex-col" contentContainerClassName="gap-4">
        <Header>
            <View>
                <Text className="font-medium">{listing.title}</Text>
            </View>
        </Header>
        <FullListingCard {...listing} />
        {!authenticated ? <LoginPopover /> : <></>}
    </ScrollView> : <></>
}