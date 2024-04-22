import { readItems } from "@directus/sdk"
import { useQuery } from "@tanstack/react-query"
import { FlatList, Image, View } from "react-native"
import { buildAssetUrl, shortString } from "~/lib/helpers"
import directusStore from "~/store/directus"
import { Room } from "~/types"
import { Text } from "~/components/ui/text"
import { Button } from "~/components/ui/button"
import { router } from "expo-router"
import { CommonFilters } from "./listings"

const LocationCard = ({ item }: { item: Pick<Room, "id" | "title" | "avatar"> }) => {
    const { rest } = directusStore()
    const { data } = useQuery({
        queryKey: ["Fetch listings count for location", item.id],
        queryFn: async () => await rest.request(readItems("listings", {
            aggregate: {
                count: "*",
            },
            filter: {
                group: {
                    id: {
                        _eq: item.id
                    }
                }
            }
        }))
    })

    const count = data && data.length ? data[0].count : 0

    return <View className="flex-col gap-4 items-center">
        <Button onPress={() => router.navigate({ pathname: "/discover", params: { id: item.id, filter: CommonFilters.GroupId } })} size={"icon"} className="relative h-16 w-16 rounded-full" variant={"ghost"}>
            <Image source={{ uri: buildAssetUrl(item.avatar!) }} className="w-16 h-16 rounded-full" />
            <View className="absolute bg-background flex-row justify-center items-center rounded-full w-8 h-8 left-auto -right-2 top-auto -bottom-2 border border-solid border-border">
                <Text className="!text-xs !text-foreground">{count}</Text>
            </View>
        </Button>
        <Text className="text-sm text-center">{shortString(item.title!, 10)}</Text>
    </View>
}

export const LocationCards = () => {
    const { rest } = directusStore()
    const { data, isLoading } = useQuery({
        queryKey: ["Fetching Locations"],
        queryFn: async () => await rest.request(readItems("rooms", {
            fields: ["id", "title", "avatar"],
            filter: {
                type: {
                    _eq: "group"
                }
            }
        })),
    }) as {
        data: Pick<Room, "id" | "title" | "avatar">[], isLoading: boolean
    }
    return !isLoading && <FlatList
        horizontal={true}
        data={data}
        renderItem={({ item }) => <LocationCard item={item} />}
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
    />
}