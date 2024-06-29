import { readItems } from "@directus/sdk"
import { useInfiniteQuery } from "@tanstack/react-query"
import { Text } from "app/components/ui/text"
import { ViewAllButton } from "app/components/utils/common-ui"
import { FlatList } from "app/components/utils/virtual-lists"
import { useColorScheme } from "app/hooks/color-scheme"
import { InViewPort } from "app/lib/detect-viewport"
import { DotSeparatedKeys } from "app/lib/helpers"
import { Filter, FilterParam } from "app/screens/listings"
import directusStore from "app/store/directus"
import userStore from "app/store/user"
import { ActivityIndicator, FlatListProps, View } from "react-native"
import { AdvertisementCard, AdvertisementCardProps } from "../atoms/advertisements"
import { ExtraSmallListingCard, ExtraSmallListingCardProps } from "../atoms/extra-small"
import { MediumListingCard, MediumListingCardProps } from "../atoms/medium"
import { PhotoListingCard, PhotoListingProps } from "../atoms/photo"
import { SmallListingCard, SmallListingCardProps } from "../atoms/small"
import useRouting from "app/hooks/use-routing"
import { Button } from "app/components/ui/button"

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

const smallFields: DotSeparatedKeys<SmallListingCardProps>[] = ["id", "title", "budget", "deal_type", "user_created.id", "user_created.avatar", "date_created", "location.id", "location.title", "location.avatar", "tags"];

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

export const RenderListings = <R extends ListCardProps>({ paramFilter: paramFilters, render, filter, flatListProps, limit = 5, searchText = "", noAds, infinite, viewAllButtonLink }: {
    render: RenderType<R>,
    filter?: ReturnType<typeof commonFilters[CommonFilters]>,
    searchText?: string,
    noAds?: boolean,
    flatListProps?: Omit<FlatListProps<ConfirmedAdvertisementCardProps | R>,
        "data" | "renderItem">,
    limit?: number,
    infinite?: boolean,
    paramFilter?: FilterParam[],
    viewAllButtonLink?: string
}) => {
    const goToListings = useRouting("listings")

    const isAdvertisementCard = (item: ConfirmedAdvertisementCardProps | R): item is ConfirmedAdvertisementCardProps => {
        return (item as ConfirmedAdvertisementCardProps).isAdvertisement !== undefined;
    }

    const { rest } = directusStore()
    const isMedium = render === bodies.medium


    const { data, hasNextPage, fetchNextPage, isLoading } = useInfiniteQuery<{ items: (R | ConfirmedAdvertisementCardProps)[], page: unknown }>({
        initialPageParam: 0,
        queryKey: ["Fetching Listings with fields: ", render.fields, filter, searchText, limit],
        queryFn: async ({ pageParam }) => {
            const page = pageParam as number
            let items: (R | ConfirmedAdvertisementCardProps)[] = []
            const listings = await rest.request(readItems("listings", {
                fields: render.fields,
                limit: limit,
                offset: limit * page,
                sort: ["-date_created"],
                search: searchText,
                filter: filter ?? {},
            })) as R[]

            items.push(...listings)

            if (isMedium && !noAds && listings.length) {
                const ads = await rest.request(readItems("advertisements", {
                    fields: ["id", "caption", "title", "photo", "link_to_open", "date_created", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "user_created.email"],
                    filter: {
                        isActive: {
                            _eq: true
                        }
                    },
                    sort: ["-date_created"],
                    limit: Math.ceil(limit / 5),
                    offset: Math.ceil(limit / 5) * page
                })).then(res => res.map(r => ({ ...r, isAdvertisement: true }))) as ConfirmedAdvertisementCardProps[]
                items = mergeArraysRandomly(items, ads)
            }
            return {
                items: items,
                page: pageParam
            }
        },
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.items.length < limit) {
                return null
            }
            return Number(lastPageParam) + 1
        }
    })

    return <FlatList
        {...flatListProps}
        data={data?.pages.map(page => page.items).flat() ?? []}
        renderItem={({ item }) => {
            if (isAdvertisementCard(item)) {
                return <AdvertisementCard {...item} />
            } else return <render.renderMethod {...item} />
        }}
        ItemSeparatorComponent={flatListProps?.ItemSeparatorComponent ?? (() => <View className="w-4 h-4" />)}
        keyExtractor={(item) => item.id}
        ListFooterComponent={
            infinite ? () => <BottomLoader endReached={!isLoading && !hasNextPage} onEndReached={fetchNextPage} /> :
                <ViewAllButton horizontal={!!flatListProps?.horizontal} button={(props) => <Button onPress={() => goToListings(paramFilters)} {...props} />} />}
    />
}

export const BottomLoader = ({ endReached, onEndReached }: { endReached: boolean, onEndReached: () => void }) => {
    const { colors } = useColorScheme()
    return endReached ? <View className="w-full h-20 flex-col justify-center items-center">
        <Text className="text-destructive">No more items to show</Text>
    </View> : <InViewPort onEnter={onEndReached}>
        <View className="w-full h-20 flex-col justify-center items-center">
            <ActivityIndicator color={colors.info} />
            <Text className="text-center text-info">loading please wait ...</Text>
        </View>
    </InViewPort>
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