import { readItems } from "@directus/sdk"
import { useIsFocused } from "@react-navigation/native"
import { useQuery } from "@tanstack/react-query"
import { FlatList, FlatListProps, View } from "react-native"
import directusStore from "~/store/directus"
import userStore from "~/store/user"
import { ExtraSmallListingCard, ExtraSmallListingCardProps } from "../molecules/extra-small"
import { MediumListingCard, MediumListingCardProps } from "../molecules/medium"
import { SmallListingCard, SmallListingCardProps } from "../molecules/small"

type ListCardProps = SmallListingCardProps | ExtraSmallListingCardProps | MediumListingCardProps

interface RenderType<T extends ListCardProps> {
    fields: string[],
    renderMethod: (props: T) => JSX.Element
}

export enum CommonFilters {
    Featured = 'featured',
    ViewedByMe = 'viewed-by-me',
    SavedByMe = 'saved-by-me',
    GroupId = 'groupId'
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

export const RenderListings = <R extends ListCardProps>({ data, render, filterMethod, flatListProps, limit, searchText }: { data?: R[], render: RenderType<R>, filterMethod?: ReturnType<typeof commonFilters[CommonFilters]>, searchText?: string, flatListProps?: Omit<FlatListProps<R>, "data" | "renderItem">, limit?: number }) => {

    const { rest } = directusStore()
    const isFocused = useIsFocused()

    const { data: res, isLoading } = useQuery({
        queryKey: ["Fetching Listings with fields: ", ...render.fields, filterMethod, searchText, isFocused],
        queryFn: async () => await rest.request(readItems("listings", {
            fields: render.fields,
            limit: limit ?? 5,
            sort: ["-date_created"],
            search: searchText ?? "",
            filter: filterMethod ? filterMethod : {}
        })),
    }) as { data: Array<R>, isLoading: boolean }

    return !isLoading &&
        <FlatList
            {...flatListProps}
            data={data ?? res}
            renderItem={({ item }) => <render.renderMethod {...item} />}
            ItemSeparatorComponent={flatListProps?.ItemSeparatorComponent ?? (() => <View className="w-4 h-4" />)}
        />
}