import { readItems } from "@directus/sdk"
import { HorizontalFlatList } from "@idiosync/horizontal-flatlist"
import { HorizontalFlatListProps } from "@idiosync/horizontal-flatlist/dist/horizontal-flat-list"
import { useQuery } from "@tanstack/react-query"
import { GoToLocationListingsButton } from "app/components/link-buttons"
import { Button } from "app/components/ui/button"
import { Text } from "app/components/ui/text"
import { buildAssetUrl, shortString } from "app/lib/helpers"
import { Room } from "app/lib/types"
import directusStore from "app/store/directus"
import { Image, View } from "react-native"
import { ArrowUpRight } from "app/components/icons"

type SmallLocationCardProps = Pick<Room, "id" | "avatar" | "title">

const SmallLocationCard = ({ item }: { item: SmallLocationCardProps }) => {
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

    return <View className="flex-col gap-4 items-center my-2">
        <GoToLocationListingsButton className="relative h-16 w-16 rounded-full" roomId={item.id} >
            <Image source={{ uri: buildAssetUrl(item.avatar!) }} className="w-16 h-16 rounded-full" />
            <View className="absolute bg-card flex-row justify-center items-center rounded-full w-8 h-8 left-auto -right-2 top-auto -bottom-2">
                <Text className="!text-xs !text-card-foreground">{count}</Text>
            </View>
        </GoToLocationListingsButton>
        <Text className="text-sm text-center">{shortString(item.title!, 10)}</Text>
    </View>
}

export const SmallLocationCards = ({ flatListProps }: { flatListProps?: Omit<HorizontalFlatListProps<SmallLocationCardProps>, "data" | "renderItem"> }) => {
    const { rest } = directusStore()
    const { data, isLoading } = useQuery<SmallLocationCardProps[]>({
        queryKey: ["Fetching Locations"],
        queryFn: async () => await rest.request(readItems("rooms", {
            fields: ["id", "title", "avatar"],
            filter: {
                type: {
                    _eq: "group"
                }
            }
        })) as SmallLocationCardProps[],
    })
    return !isLoading && <HorizontalFlatList
        data={data}
        renderItem={({ item }) => <SmallLocationCard item={item} />}
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        numRows={2}
        keyExtractor={item => item.id}
        ListFooterComponent={() => <Button variant={"ghost"} size={"none"} className="h-28 w-28 ml-4 flex-col gap-1">
            <Text className="text-subtext">View all</Text>
            <ArrowUpRight className="text-info" />
        </Button>}
        {...flatListProps}
    />
}