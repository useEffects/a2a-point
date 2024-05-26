import { ScrollView, View } from "react-native"
import directusStore from "app/store/directus"
import { useParams } from "solito/navigation"
import { createItem, readItem, readItems } from "@directus/sdk"
import { FullListingCard, FullListingCardFields, FullListingDetailed } from "app/components/listings-cards/atoms/full"
import { useEffect, useState } from "react"
import { Header } from "app/components/header"
import { Text } from "app/components/ui/text"
import { queryClient } from "app/store/query"
import userStore from "app/store/user"
import { LoginPopover } from "app/screens/home"

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
        if (!params.id || !listing) return
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
                console.log(error)
            }
        }
        addViewCount()
    }, [params.id, rest, user.id, listing])

    return listing ? <ScrollView className="flex-col gap-4">
        <Header>
            <View>
                <Text className="text-medium">{listing.title}</Text>
            </View>
        </Header>
        <View className="px-4">
            <FullListingCard {...listing} />
        </View>
        {!authenticated ? <LoginPopover /> : <></>}
    </ScrollView> : <></>
}