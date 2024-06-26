import { readItems } from "@directus/sdk"
import { HorizontalFlatList } from "@idiosync/horizontal-flatlist"
import { HorizontalFlatListProps } from "@idiosync/horizontal-flatlist/dist/horizontal-flat-list"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { GoToLocationListingsButton, GoToLocationsListButton, GoToMembersListButton, GoToRoomButton } from "app/components/link-buttons"
import { Button, ButtonProps } from "app/components/ui/button"
import { Text } from "app/components/ui/text"
import { buildAssetUrl, getDMRoomId, shortString } from "app/lib/helpers"
import { Room, User } from "app/lib/types"
import directusStore from "app/store/directus"
import { Dimensions, FlatListProps, Image, Platform, View } from "react-native"
import { ArrowUpRight, Rows2, Users } from "app/components/icons"
import { ComponentType, useEffect, useState } from "react"
import { FlatList } from "app/components/utils/virtual-lists"
import { getListingsCountForLocation, getMembersCountForLocation } from "app/lib/misc/get-counts"
import { queryClient } from "app/store/query"
import { BottomLoader } from "./listings"
import { useColorScheme } from "app/hooks/color-scheme"
import opacity from "hex-color-opacity"
import { ViewAllButton } from "app/components/utils/common-ui"

type SmallLocationCardProps = Pick<Room, "id" | "avatar" | "title">
type MediumLocationCardProps = Pick<Room, "id" | "avatar" | "title"> & {
    members: {
        id: string,
        rooms_id: string,
        directus_users_id: {
            id: string
            avatar: string,
        }
    }[]
}

const SmallLocationCard = ({ item }: { item: SmallLocationCardProps }) => {
    const [count, setCount] = useState(0)

    useEffect(() => {
        getListingsCountForLocation(item.id).then(setCount)
    }, [])

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
        queryKey: ["Fetching Locations for small location cards"],
        queryFn: async () => await rest.request(readItems("rooms", {
            fields: ["id", "title", "avatar"],
            filter: {
                type: {
                    _eq: "group"
                }
            },
            limit: 15
        })) as SmallLocationCardProps[],
    })
    return !isLoading && <HorizontalFlatList
        overScrollMode="never"
        data={data}
        renderItem={({ item }) => <SmallLocationCard item={item} />}
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        numRows={2}
        keyExtractor={item => item.id}
        ListFooterComponent={<ViewAllButton horizontal={true} button={(props: ButtonProps) => <GoToLocationsListButton {...props} />} />}
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

    useEffect(() => {
        getMembersCountForLocation(item.id).then(setMembersCount)
        getListingsCountForLocation(item.id).then(setListingsCount)
    }, [])

    return <GoToLocationListingsButton roomId={item.id} className="flex-row rounded-xl bg-card justify-start items-start w-full aspect-video">
        <Image source={{ uri: buildAssetUrl(item.avatar) }} className="w-1/2 h-full rounded-tl-xl rounded-bl-xl" resizeMode="cover" />
        <View className="h-full flex-col justify-start gap-2 p-4 w-1/2">
            <Text className="font-medium">{item.title}</Text>
            <Text className="text-success">{listingsCount} leads available</Text>
            <MembersList locationId={item.id} members={item.members.slice(0, 5)} total={membersCount} />
            <Button disabled={!authenticated} className="mt-auto mb-0 flex-row">
                <GoToRoomButton roomId={item.id} className="flex-row">
                    <Text>Group chat</Text>
                    <ArrowUpRight size={18} className="text-primary-foreground" />
                </GoToRoomButton>
            </Button>
        </View>
    </GoToLocationListingsButton>
}

export const MediumLocationCards = ({ limit = 5, searchText = "", infinite, flatListProps }: { limit?: number, infinite?: boolean, searchText?: string, flatListProps?: Omit<FlatListProps<MediumLocationCardProps>, "data" | "renderItem"> }) => {
    const { rest } = directusStore()

    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<{ items: MediumLocationCardProps[], page: unknown }>({
        queryKey: ["Fetching Locations for medium card", searchText, limit, infinite],
        queryFn: async ({ pageParam }) => {
            const res = await rest.request(readItems("rooms", {
                fields: ["id", "title", "avatar", "members.*", "members.directus_users_id.avatar"],
                filter: {
                    type: {
                        _eq: "group"
                    }
                },
                search: searchText,
                limit: limit,
                offset: pageParam as number * limit
            }))
            return { items: res as MediumLocationCardProps[], page: pageParam }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.items.length < limit) return undefined
            else return Number(lastPageParam) + 1
        }
    })

    return <FlatList
        data={data?.pages.map(page => page.items).flat() ?? []}
        renderItem={({ item }) => <MediumLocationCard item={item} />}
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        ListFooterComponent={infinite ?
            <BottomLoader endReached={!hasNextPage} onEndReached={fetchNextPage} /> :
            <ViewAllButton horizontal={false} button={(props) => <GoToLocationsListButton {...props} />} />}
        {...flatListProps}
    />
}

export const MembersList = ({ members, total, locationId }: {
    members: {
        directus_users_id: Pick<User, "avatar">,
    }[], total: number, locationId: string
}) => {
    const { colors } = useColorScheme()
    const faces = members.map(member => ({
        imageUrl: buildAssetUrl(member.directus_users_id.avatar)
    }))

    return total ? <View className="flex-row relative self-start">
        {faces.map((face, i) => <Image key={i} className="w-12 h-12 -mr-4 rounded-full border-background  border-1 border" source={{ uri: face.imageUrl }} />)}
        <GoToMembersListButton locationId={locationId} className="absolute -right-4 w-12 h-12 flex-col rounded-full justify-center items-center" variant={"base"} size={"none"} style={{ backgroundColor: opacity(colors.info, 0.75), zIndex: 10, elevation: 10 }}>
            <Text className="text-info-foreground text-xs">{total}+</Text>
            <ArrowUpRight className="text-info-foreground" size={12} />
        </GoToMembersListButton>
    </View> : <Text className="text-warning">No members yet</Text>
}