import { readItems } from "@directus/sdk"
import { useIsFocused } from "app/hooks/is-focused"
import { FlatListProps, View } from "react-native"
import directusStore from "app/store/directus"
import userStore from "app/store/user"
import { ExtraSmallListingCard, ExtraSmallListingCardProps } from "../atoms/extra-small"
import { MediumListingCard, MediumListingCardProps } from "../atoms/medium"
import { SmallListingCard, SmallListingCardProps } from "../atoms/small"
import { AdvertisementCard, AdvertisementCardProps } from "./advertisements"
import { ComponentType, useEffect, useState } from "react"
import { queryClient } from "app/store/query"
import { FlatList } from "app/components/utils/virtual-lists"
import { PhotoListingCard, PhotoListingProps } from "../atoms/photo"

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
    Listing = "listing",
    Enquiry = "enquiry",
    Sale = "sale",
    Rent = "rent",
    User = "user",
    Photo = "with-photo"
}

export const commonFilterTitles: { [K in CommonFilters]: ((label: string) => string) | string } = {
    [CommonFilters.Premium]: "Premium",
    [CommonFilters.ViewedByMe]: "Viewed by Me",
    [CommonFilters.SavedByMe]: "Saved by Me",
    [CommonFilters.GroupId]: "Group",
    [CommonFilters.Listing]: "Listing",
    [CommonFilters.Enquiry]: "Enquiry",
    [CommonFilters.Sale]: "Sale",
    [CommonFilters.Rent]: "Rent",
    [CommonFilters.User]: (label: string) => label,
    [CommonFilters.Photo]: "With Photo"
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
    [CommonFilters.Rent]: () => ({
        deal_type: {
            _eq: "rent"
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
    })
};

export const bodies = {
    extraSmall: {
        fields: ["id", "title", "price", "type", "date_created"],
        renderMethod: ExtraSmallListingCard
    },
    small: {
        fields: ["id", "title", "price", "address", "type", "user_created.id", "user_created.avatar", "date_created"],
        renderMethod: SmallListingCard
    },
    medium: {
        fields: ["id", "title", "price", "address", "description", "type", "deal_type", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "user_created.email", "date_created"],
        renderMethod: MediumListingCard
    },
    photo: {
        fields: ["id", "title", "price", "type", "photo_1", "photo_2", "photo_3", "user_created.id", "user_created.avatar", "user_created.first_name", "user_created.last_name", "date_created"],
        renderMethod: PhotoListingCard
    }
}

type ConfirmedAdvertisementCardProps = AdvertisementCardProps & { isAdvertisement: true }

export const RenderListings = <R extends ListCardProps>({ data, render, filterMethod, flatListProps, limit = 5, searchText, noAds, flatListComponent, infinite }: {
    data?: R[],
    render: RenderType<R>,
    filterMethod?: ReturnType<typeof commonFilters[CommonFilters]>,
    searchText?: string,
    noAds?: boolean,
    flatListProps?: Omit<FlatListProps<ConfirmedAdvertisementCardProps | R>,
        "data" | "renderItem">,
    limit?: number,
    flatListComponent?: ComponentType<FlatListProps<ConfirmedAdvertisementCardProps | R>>,
    infinite?: boolean
}) => {

    const isAdvertisementCard = (item: ConfirmedAdvertisementCardProps | R): item is ConfirmedAdvertisementCardProps => {
        return (item as ConfirmedAdvertisementCardProps).isAdvertisement !== undefined;
    }

    const { rest } = directusStore()
    const isFocused = useIsFocused()
    const [offset, setOffset] = useState(0)
    const [endReached, setEndReached] = useState(false)
    const [items, setItems] = useState<(R | ConfirmedAdvertisementCardProps)[]>([])

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
                queryKey: ["Fetching Listings with fields: ", ...render.fields, JSON.stringify(filterMethod), searchText, isFocused, offset, limit],
                queryFn: async () => await rest.request(readItems("listings", {
                    fields: render.fields,
                    limit: limit,
                    offset: limit * offset,
                    sort: ["-date_created"],
                    search: searchText ?? "",
                    filter: filterMethod ?? {},
                })) as R[],
                initialData: [],
            })

            _items.push(...listings)

            if (isMedium && !noAds) {
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
                setItems([...items, ..._items])
            } else {
                setEndReached(true)
            }
        }
        fetchData()
    }, [offset, endReached])

    const FlatListComponent = flatListComponent ?? FlatList

    return (items.length) ?
        <FlatListComponent
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
        /> : <></>
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