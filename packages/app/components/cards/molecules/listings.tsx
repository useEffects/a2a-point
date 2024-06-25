import { readItems } from "@directus/sdk"
import { FlatList } from "app/components/utils/virtual-lists"
import directusStore from "app/store/directus"
import { queryClient } from "app/store/query"
import userStore from "app/store/user"
import { ComponentType, useEffect, useMemo, useRef, useState } from "react"
import { ActivityIndicator, FlatList as RNFlatList, FlatListProps, View } from "react-native"
import { ExtraSmallListingCard, ExtraSmallListingCardProps } from "../atoms/extra-small"
import { MediumListingCard, MediumListingCardProps } from "../atoms/medium"
import { PhotoListingCard, PhotoListingProps } from "../atoms/photo"
import { SmallListingCard, SmallListingCardProps } from "../atoms/small"
import { AdvertisementCard, AdvertisementCardProps } from "../atoms/advertisements"
import { useColorScheme } from "app/hooks/color-scheme"
import { Text } from "app/components/ui/text"
import { GoToListingsListButton } from "app/components/link-buttons"
import { ViewAllButton } from "app/components/utils/common-ui"
import { Button, ButtonProps } from "app/components/ui/button"
import { FilterKeys, FilterType } from "app/screens/listings"
import * as Linking from "expo-linking"
import { DotSeparatedKeys } from "app/lib/helpers"

type ListCardProps = SmallListingCardProps | ExtraSmallListingCardProps | MediumListingCardProps | PhotoListingProps

interface RenderType<T extends ListCardProps> {
    fields: string[],
    renderMethod: (props: T) => JSX.Element
}

export enum CommonFilters {
    Premium = 'premium',
    ViewedByMe = 'viewed-by-me',
    SavedByMe = 'saved-by-me',
    GroupId = 'groupId',
    Buy = "buy",
    Sale = "sale",
    GiveOnRent = "give-on-rent",
    TakeOnRent = "take-on-rent",
    User = "user",
    Photo = "with-photo",
    Custom = "custom",
    None = "none"
}

export const commonFilterTitles: { [K in CommonFilters]: ((label: string) => string) | string } = {
    [CommonFilters.Premium]: "Premium",
    [CommonFilters.ViewedByMe]: "Viewed by Me",
    [CommonFilters.SavedByMe]: "Saved by Me",
    [CommonFilters.GroupId]: "Group",
    [CommonFilters.Buy]: "Buy",
    [CommonFilters.Sale]: "Sale",
    [CommonFilters.GiveOnRent]: "Give on rent",
    [CommonFilters.TakeOnRent]: "Take on rent",
    [CommonFilters.User]: (label: string) => label,
    [CommonFilters.Photo]: "With Photo",
    [CommonFilters.Custom]: "Custom",
    [CommonFilters.None]: "None"
}

export const commonFilters = {
    [CommonFilters.Premium]: () => ({
        featured: {
            _eq: true
        }
    }),
    [CommonFilters.ViewedByMe]: () => ({
        viewed_by: {
            directus_users_id: {
                _eq: userStore.getState().user.id
            }
        }
    }),
    [CommonFilters.SavedByMe]: () => ({
        saved_by: {
            directus_users_id: {
                _eq: userStore.getState().user.id
            }
        }
    }),
    [CommonFilters.GroupId]: (groupId: string) => ({
        group: {
            id: {
                _eq: groupId
            }
        }
    }),
    [CommonFilters.Buy]: () => ({
        deal_type: {
            _eq: "buy"
        }
    }),
    [CommonFilters.Sale]: () => ({
        deal_type: {
            _eq: "sale"
        }
    }),
    [CommonFilters.GiveOnRent]: () => ({
        deal_type: {
            _eq: "give on rent"
        }
    }),
    [CommonFilters.TakeOnRent]: () => ({
        deal_type: {
            _eq: "take on rent"
        }
    }),
    [CommonFilters.User]: (userId: string) => ({
        user_created: {
            id: {
                _eq: userId
            }
        }
    }),
    [CommonFilters.Photo]: () => ({
        _or: [
            {
                photo_1: {
                    _neq: null
                }
            },
            {
                photo_2: {
                    _neq: null
                }
            },
            {
                photo_3: {
                    _neq: null
                }
            }
        ]
    }),
    [CommonFilters.Custom]: (filters: Record<string, any>[]) => {
        return {
            _and: filters
        }
    },
    [CommonFilters.None]: () => ({})
};

const extraSmallFields: DotSeparatedKeys<ExtraSmallListingCardProps>[] = ["id", "title", "budget"];

const smallFields: DotSeparatedKeys<SmallListingCardProps>[] = ["id", "title", "price", "address", "deal_type", "user_created.id", "user_created.avatar", "date_created", "group.id", "group.title", "group.avatar", "tags"];

const mediumFields: DotSeparatedKeys<MediumListingCardProps>[] = ["id", "title", "deal_type", "date_created", "budget", "description", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "location.avatar", "location.avatar", "location.id", "location.title"];

const photoFields: DotSeparatedKeys<PhotoListingProps>[] = ["id", "title", "budget", "photo_1", "photo_2", "photo_3", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name"];

export const bodies = {
    extraSmall: {
        fields: extraSmallFields,
        renderMethod: ExtraSmallListingCard
    },
    small: {
        fields: smallFields,
        renderMethod: SmallListingCard
    },
    medium: {
        fields: mediumFields,
        renderMethod: MediumListingCard
    },
    photo: {
        fields: photoFields,
        renderMethod: PhotoListingCard
    }
}

type ConfirmedAdvertisementCardProps = AdvertisementCardProps & { isAdvertisement: true }

export const RenderListings = <R extends ListCardProps>({ paramFilter, render, filter, flatListProps, limit = 5, searchText = "", noAds, infinite, viewAllButtonLink }: {
    render: RenderType<R>,
    filter?: ReturnType<typeof commonFilters[CommonFilters]>,
    searchText?: string,
    noAds?: boolean,
    flatListProps?: Omit<FlatListProps<ConfirmedAdvertisementCardProps | R>,
        "data" | "renderItem">,
    limit?: number,
    infinite?: boolean,
    paramFilter?: {
        key: FilterKeys,
        id: string
    },
    viewAllButtonLink?: string
}) => {

    const isAdvertisementCard = (item: ConfirmedAdvertisementCardProps | R): item is ConfirmedAdvertisementCardProps => {
        return (item as ConfirmedAdvertisementCardProps).isAdvertisement !== undefined;
    }

    const { rest } = directusStore()
    const [offset, setOffset] = useState(0)
    const [endReached, setEndReached] = useState(false)
    const [items, setItems] = useState<(R | ConfirmedAdvertisementCardProps)[]>([])
    const { colors } = useColorScheme()
    const ref = useRef<RNFlatList<ConfirmedAdvertisementCardProps | R>>(null)

    const onEndReached = () => {
        if (!infinite || endReached) return
        setOffset(p => p + 1)
    }

    const isMedium = render === bodies.medium

    useEffect(() => {
        async function fetchData() {
            if (endReached) return
            let _items: (R | ConfirmedAdvertisementCardProps)[] = []
            const listings = await queryClient.fetchQuery<R[]>({
                queryKey: ["Fetching Listings with fields: ", render.fields, filter, searchText, offset, limit],
                queryFn: async () => await rest.request(readItems("listings", {
                    fields: render.fields,
                    limit: limit,
                    offset: limit * offset,
                    sort: ["-date_created"],
                    search: searchText,
                    filter: filter ?? {},
                })) as R[],
                initialData: [],
            })

            _items.push(...listings)

            if (isMedium && !noAds && listings.length) {
                const ads = await queryClient.fetchQuery<ConfirmedAdvertisementCardProps[]>({
                    queryKey: ["Fetch Ads"],
                    queryFn: async () => await rest.request(readItems("advertisements", {
                        fields: ["id", "caption", "title", "photo", "date_created", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "user_created.email"],
                        filter: {
                            isActive: {
                                _eq: true
                            }
                        },
                        sort: ["-date_created"],
                        limit: Math.ceil(limit / 5),
                        offset: offset
                    })).then(res => res.map(r => ({ ...r, isAdvertisement: true }))) as ConfirmedAdvertisementCardProps[],
                    initialData: [],
                })
                _items = mergeArraysRandomly(_items, ads)
            }

            if (_items.length) {
                setItems(p => [...p, ..._items])
            } else {
                setEndReached(true)
            }
        }
        fetchData()
    }, [offset, endReached])

    return (items.length) ?
        <FlatList
            {...flatListProps}
            data={items}
            renderItem={({ item }) => {
                if (isAdvertisementCard(item)) {
                    return <AdvertisementCard {...item} />
                } else return <render.renderMethod {...item} />
            }}
            ItemSeparatorComponent={flatListProps?.ItemSeparatorComponent ?? (() => <View className="w-4 h-4" />)}
            onEndReached={onEndReached}
            onEndReachedThreshold={0}
            keyExtractor={(item) => item.id}
            ListFooterComponent={
                infinite ? () => <BottomLoader endReached={endReached} /> :
                    <ViewAllButton horizontal={!!flatListProps?.horizontal} button={(props) => viewAllButtonLink ?
                        <Button {...props} onPress={() => Linking.openURL(viewAllButtonLink)} /> : <GoToListingsListButton {...props} filter={paramFilter} />} />}
        /> : <></>
}

export const BottomLoader = ({ endReached }: { endReached: boolean }) => {
    const { colors } = useColorScheme()
    return endReached ? <View className="w-full h-20 flex-col justify-center items-center">
        <Text className="text-destructive">No more items to show</Text>
    </View> : <View className="w-full h-20 flex-col justify-center items-center">
        <ActivityIndicator color={colors.info} />
        <Text className="text-center text-info">loading please wait ...</Text>
    </View>
}

function mergeArraysRandomly<T1, T2>(array1: T1[], array2: T2[]): (T1 | T2)[] {
    const result: (T1 | T2)[] = [];
    let i = 0;
    let j = 0;

    if (array1.length > 0) {
        result.push(array1[i]!);
        i++;
    }

    while (i < array1.length && j < array2.length) {
        if (Math.random() < 0.5) {
            result.push(array1[i]!);
            i++;
        } else {
            result.push(array2[j]!);
            j++;
        }
    }

    while (i < array1.length) {
        result.push(array1[i]!);
        i++;
    }

    while (j < array2.length) {
        result.push(array2[j]!);
        j++;
    }

    return result;
}