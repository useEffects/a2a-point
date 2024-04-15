import { readItems } from "@directus/sdk"
import { useQuery } from "@tanstack/react-query"
import directusStore from "~/store/directus"
import { SmallListingCard, SmallListingCardProps } from "../molecules/small"
import { FlatList, FlatListProps, View } from "react-native"
import userStore from "~/store/user"
import { ExtraSmallListingCard, ExtraSmallListingCardProps } from "../molecules/extra-small"
import { Listing } from "~/types"

type ListCardProps = SmallListingCardProps | ExtraSmallListingCardProps

interface RenderType<T extends ListCardProps> {
    fields: string[],
    renderMethod: (props: T) => JSX.Element
}

export const commonFilters = {
    filterFeatured: {
        featured: {
            _eq: true
        }
    },
    filterViewedByMe: {
        viewed_by: {
            directus_users_id: {
                id: {
                    _eq: userStore.getState().user.id
                }
            }
        }
    }
}

export const bodies = {
    extraSmall: {
        fields: ["id", "title", "price", "type"],
        renderMethod: ExtraSmallListingCard
    },
    small: {
        fields: ["id", "title", "price", "address", "type", "user_created.id", "user_created.avatar"],
        renderMethod: SmallListingCard
    }
}

export const RenderListings = <R extends ListCardProps>({ render, filter, flatListProps }: { render: RenderType<R>, filter?: typeof commonFilters[keyof typeof commonFilters], flatListProps?: Omit<FlatListProps<R>, "data" | "renderItem"> }) => {

    const { rest } = directusStore()
    const { data, isLoading } = useQuery({
        queryKey: ["Fetching Listings with fields: ", ...render.fields],
        queryFn: async () => await rest.request(readItems("listings", {
            fields: render.fields,
            limit: 5,
            sort: ["-date_created"],
            filter: filter ?? {}
        })),
    }) as { data: Array<R>, isLoading: boolean }
    return !isLoading &&
        <FlatList
            {...flatListProps}
            data={data}
            renderItem={({ item }) => <render.renderMethod {...item} />}
            ItemSeparatorComponent={flatListProps?.ItemSeparatorComponent ?? (() => <View className="w-4 h-4" />)}
        />
}