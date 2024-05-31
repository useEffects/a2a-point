import { readItems } from "@directus/sdk"
import { useQuery } from "@tanstack/react-query"
import { Button } from "app/components/ui/button"
import { Text } from "app/components/ui/text"
import { buildAssetUrl, shortString } from "app/lib/helpers"
import { Room } from "app/lib/types"
import directusStore from "app/store/directus"
import { FlatList, FlatListProps, Image, View } from "react-native"
import { GoToLocationListingsButton } from "app/components/utils"

type LocationCardsProps = Pick<Room, "id" | "avatar" | "title">

const LocationCard = ({ item }: { item: LocationCardsProps }) => {
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

    const count = data && data.length ? data[0]!.count : 0

    return <View className="flex-col gap-4 items-center">
        <GoToLocationListingsButton className="relative h-16 w-16 rounded-full" roomId={item.id} >
            <Image source={{ uri: buildAssetUrl(item.avatar!) }} className="w-16 h-16 rounded-full" />
            <View className="absolute bg-card flex-row justify-center items-center rounded-full w-8 h-8 left-auto -right-2 top-auto -bottom-2">
                <Text className="!text-xs !text-card-foreground">{count}</Text>
            </View>
        </GoToLocationListingsButton>
        <Text className="text-sm text-center">{shortString(item.title!, 10)}</Text>
    </View>
}

export const LocationCards = ({ flatListProps }: { flatListProps?: Omit<FlatListProps<LocationCardsProps>, "data" | "renderItem"> }) => {
    const { rest } = directusStore()
    const { data, isLoading } = useQuery<LocationCardsProps[]>({
        queryKey: ["Fetching Locations"],
        queryFn: async () => await rest.request(readItems("rooms", {
            fields: ["id", "title", "avatar"],
            filter: {
                type: {
                    _eq: "group"
                }
            }
        })) as LocationCardsProps[],
    })
    return !isLoading && <FlatList
        horizontal={true}
        data={data}
        renderItem={({ item }) => <LocationCard item={item} />}
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        {...flatListProps}
    />
}