import { readItems } from "@directus/sdk"
import { useIsFocused } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import { FlatList, FlatListProps, View } from "react-native"
import directusStore from "~/store/directus"
import userStore from "~/store/user"
import { ExtraSmallListingCard, ExtraSmallListingCardProps } from "../molecules/extra-small"
import { MediumListingCard, MediumListingCardProps } from "../molecules/medium"
import { SmallListingCard, SmallListingCardProps } from "../molecules/small"
import { AdvertisementCard, AdvertisementCardProps } from "./advertisements"
import shuffle from "shuffle-array"

type ListCardProps = SmallListingCardProps | ExtraSmallListingCardProps | MediumListingCardProps

interface RenderType<T extends ListCardProps> {
    fields: string[],
    renderMethod: (props: T) => JSX.Element
}

export enum CommonFilters {
    Featured = 'featured',
    ViewedByMe = 'viewed-by-me',
    SavedByMe = 'saved-by-me',
    GroupId = 'groupId',
    Listing = "listing",
    Enquiry = "enquiry",
    Sale = "sale",
    Buy = "buy",
    Rent = "rent",
}

export const commonFilters = {
    [CommonFilters.Featured]: () => ({
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
    [CommonFilters.Listing]: () => ({
        type: {
            _eq: "listing"
        }
    }),
    [CommonFilters.Enquiry]: () => ({
        type: {
            _eq: "enquiry"
        }
    }),
    [CommonFilters.Sale]: () => ({
        deal_type: {
            _eq: "sell"
        }
    }),
    [CommonFilters.Buy]: () => ({
        deal_type: {
            _eq: "buy"
        }
    }),
    [CommonFilters.Rent]: () => ({
        deal_type: {
            _eq: "rent"
        }
    })
};

export const bodies = {
    extraSmall: {
        fields: ["id", "title", "price", "type"],
        renderMethod: ExtraSmallListingCard
    },
    small: {
        fields: ["id", "title", "price", "address", "type", "user_created.id", "user_created.avatar"],
        renderMethod: SmallListingCard
    },
    medium: {
        fields: ["id", "title", "price", "address", "description", "type", "deal_type", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "user_created.email"],
        renderMethod: MediumListingCard
    }
}

type ConfirmedAdvertisementCardProps = AdvertisementCardProps & { isAdvertisement: true }

export const RenderListings = <R extends ListCardProps>({ data, render, filterMethod, flatListProps, limit, searchText }: { data?: R[], render: RenderType<R>, filterMethod?: ReturnType<typeof commonFilters[CommonFilters]>, searchText?: string, flatListProps?: Omit<FlatListProps<ConfirmedAdvertisementCardProps | R>, "data" | "renderItem">, limit?: number }) => {

    const isAdvertisementCard = (item: ConfirmedAdvertisementCardProps | R): item is ConfirmedAdvertisementCardProps => {
        return (item as ConfirmedAdvertisementCardProps).isAdvertisement !== undefined;
    }

    const { rest } = directusStore()
    const isFocused = useIsFocused()

    const _limit = 5

    const { data: listingsRes, isLoading: isListingsResLoading } = useQuery({
        queryKey: ["Fetching Listings with fields: ", ...render.fields, JSON.stringify(filterMethod), searchText, isFocused],
        queryFn: async () => await rest.request(readItems("listings", {
            fields: render.fields,
            limit: _limit ?? 5,
            sort: ["-date_created"],
            search: searchText ?? "",
            filter: filterMethod ? filterMethod : {},
        })),
        initialData: [],
    }) as { data: Array<R>, isLoading: boolean }

    const { data: adsRes, isLoading: isAdsResLoading } = useQuery({
        queryKey: ["Fetch Ads"],
        queryFn: async () => await rest.request(readItems("advertisements", {
            fields: ["id", "caption", "title", "photo", "date_created", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "user_created.email"],
            filter: {
                isActive: {
                    _eq: true
                }
            },
            sort: ["-date_created"],
            limit: Math.ceil(_limit / 5)
        })).then(res => res.map(r => ({ ...r, isAdvertisement: true }))),
        initialData: [],
        enabled: render === bodies.medium
    }) as { data: ConfirmedAdvertisementCardProps[], isLoading: boolean }

    const _data = data ?? listingsRes
    const items = (render === bodies.medium && !searchText) ? shuffle([..._data, ...adsRes]) : _data

    return (!isListingsResLoading && !isAdsResLoading) &&
        <FlatList
            {...flatListProps}
            data={items}
            renderItem={({ item }) => {
                if (isAdvertisementCard(item)) {
                    return <AdvertisementCard {...item} />
                } else return <render.renderMethod {...item} />
            }}
            ItemSeparatorComponent={flatListProps?.ItemSeparatorComponent ?? (() => <View className="w-4 h-4" />)}
        />
}