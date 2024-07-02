import { readItems } from "@directus/sdk"
import { HorizontalFlatList } from "@idiosync/horizontal-flatlist"
import { HorizontalFlatListProps } from "@idiosync/horizontal-flatlist/dist/horizontal-flat-list"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { ArrowUpRight } from "app/components/icons"
import { Button, ButtonProps } from "app/components/ui/button"
import { Text } from "app/components/ui/text"
import { ViewAllButton } from "app/components/utils/common-ui"
import { FlatList } from "app/components/utils/virtual-lists"
import { useColorScheme } from "app/hooks/color-scheme"
import useRouting from "app/hooks/use-routing"
import { buildAssetUrl, shortString } from "app/lib/helpers"
import { getListingsCountForLocation, getMembersCountForLocation, renderCardsQuery } from "app/lib/misc/queries"
import { Room, User } from "app/lib/types"
import directusStore from "app/store/directus"
import opacity from "hex-color-opacity"
import { useEffect, useMemo, useState } from "react"
import { FlatListProps, Image, Platform, Pressable, View } from "react-native"
import { BottomLoader } from "./listings"
import { MediumLocationCardProps, mediumLocationFields, SmallLocationCardProps } from "app/lib/props"
import { uniqBy } from "lodash"

const SmallLocationCard = ({ item }: { item: SmallLocationCardProps }) => {
    const [count, setCount] = useState(0)
    const goToLocationDetailed = useRouting("location-detailed")

    useEffect(() => {
        getListingsCountForLocation(item.id).then(setCount)
    }, [])


    return <View className="flex-col gap-4 items-center my-2">
        <Pressable className="relative h-16 w-16 rounded-full" onPress={() => goToLocationDetailed(item.id as any)}>
            <Image source={{ uri: buildAssetUrl(item.avatar!) }} className="w-16 h-16 rounded-full" />
            <View className="absolute bg-card flex-row justify-center items-center rounded-full w-8 h-8 left-auto -right-2 top-auto -bottom-2">
                <Text className="!text-xs !text-card-foreground">{count}</Text>
            </View>
        </Pressable>
        <Text className="text-sm text-center">{shortString(item.title!, 10)}</Text>
    </View>
}

export const SmallLocationCards = ({ flatListProps, data }: { flatListProps?: Omit<HorizontalFlatListProps<SmallLocationCardProps>, "data" | "renderItem">, data: SmallLocationCardProps[] }) => {
    const { rest } = directusStore()
    const goToLocationsList = useRouting("locations-list")

    return <HorizontalFlatList
        overScrollMode="never"
        data={data}
        renderItem={({ item }) => <SmallLocationCard item={item} />}
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        numRows={2}
        keyExtractor={item => item.id}
        ListFooterComponent={<ViewAllButton horizontal={true} button={(props: ButtonProps) => <Button onPress={() => goToLocationsList("")} {...props} />} />}
        ListHeaderComponent={() => <View className="w-4 h-4" />}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        {...flatListProps}
    />
}

const MediumLocationCard = ({ item }: { item: MediumLocationCardProps }) => {
    const [listingsCount, setListingsCount] = useState(0)
    const [membersCount, setMembersCount] = useState(0)
    const { authenticated } = directusStore()
    const goToLocationDetailed = useRouting("location-detailed")
    const goToRoom = useRouting("room-detailed")

    useEffect(() => {
        getMembersCountForLocation(item.id).then(setMembersCount)
        getListingsCountForLocation(item.id).then(setListingsCount)
    }, [])

    return <Pressable onPress={() => goToLocationDetailed(item.id as any)} className="flex-row rounded-xl bg-card justify-start items-start w-full aspect-video">
        <Image source={{ uri: buildAssetUrl(item.avatar) }} className="w-1/2 h-full rounded-tl-xl rounded-bl-xl" resizeMode="cover" />
        <View className="h-full flex-col justify-start gap-2 p-4 w-1/2">
            <Text className="font-medium">{item.title}</Text>
            <Text className="text-success">{listingsCount} leads available</Text>
            <MembersList locationId={item.id} members={item.members.slice(0, 5)} total={membersCount} />
            <Button onPress={() => goToRoom(item.id)} disabled={!authenticated} className="mt-auto mb-0 flex-row">
                <View className="flex-row">
                    <Text>Group chat</Text>
                    <ArrowUpRight size={18} className="text-primary-foreground" />
                </View>
            </Button>
        </View>
    </Pressable>
}

export const MediumLocationCards = ({ initialData, limit = 5, searchText = "", infinite, flatListProps }: { initialData: MediumLocationCardProps[], limit?: number, infinite?: boolean, searchText?: string, flatListProps?: Omit<FlatListProps<MediumLocationCardProps>, "data" | "renderItem"> }) => {
    const goToLocationsList = useRouting("locations-list")
    const [startedScrolling, setStartedScrolling] = useState(false)

    const shouldNotShowInitialData = Boolean(searchText)

    const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery<{ items: MediumLocationCardProps[], page: unknown }>({
        queryKey: ["Fetching Locations for medium card", searchText, limit, infinite],
        queryFn: async ({ pageParam }) => {
            const res = await renderCardsQuery<MediumLocationCardProps>({
                collection: "rooms",
                limit,
                fields: mediumLocationFields,
                filter: {
                    type: {
                        _eq: "group"
                    }
                },
                offset: Number(pageParam) * limit,
                searchText,
                deep: {
                    members: {
                        _limit: 5,
                    }
                }
            }).then(res => ({ items: res, page: pageParam }))
            return res
        },
        initialPageParam: shouldNotShowInitialData ? 0 : 1,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.items.length < limit) return undefined
            else return Number(lastPageParam) + 1
        },
    })

    const onEndReached = () => {
        setStartedScrolling(true)
        fetchNextPage()
    }

    const items = data?.pages.map(page => page.items).flat() ?? []
    const finalData = useMemo(() => {
        if (shouldNotShowInitialData) return items
        return startedScrolling ? [...initialData, ...items] : initialData
    }, [startedScrolling, data, initialData])

    return <FlatList
        data={uniqBy(finalData, "id")}
        renderItem={({ item }) => <MediumLocationCard item={item} />}
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        onEndReached={() => Platform.OS !== "web" && infinite && onEndReached()}
        ListFooterComponent={infinite ?
            <BottomLoader endReached={startedScrolling && !hasNextPage} onEndReached={() => Platform.OS === "web" && onEndReached()} /> :
            <ViewAllButton horizontal={false} button={(props) => <Button onPress={() => goToLocationsList("" as any)} {...props} />} />}
        {...flatListProps}
    />
}

export const MembersList = ({ members, total, locationId }: {
    members: {
        directus_users_id: Pick<User, "avatar">,
    }[], total: number, locationId: string
}) => {
    const goToMembersList = useRouting("members-list")
    const { colors } = useColorScheme()
    const faces = members.map(member => ({
        imageUrl: buildAssetUrl(member.directus_users_id.avatar)
    }))

    return total ? <View className="flex-row relative self-start">
        {faces.map((face, i) => <Image key={i} className="w-12 h-12 -mr-4 rounded-full border-background  border-1 border" source={{ uri: face.imageUrl }} />)}
        <Pressable className="absolute -right-4 w-12 h-12 flex-col rounded-full justify-center items-center" onPress={() => goToMembersList(locationId)} style={{ backgroundColor: opacity(colors.info, 0.75), zIndex: 10, elevation: 10 }}>
            <Text className="text-info-foreground text-xs">{total}+</Text>
            <ArrowUpRight className="text-info-foreground" size={12} />
        </Pressable>
    </View> : <Text className="text-warning">No members yet</Text>
}