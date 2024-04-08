import { readItems } from "@directus/sdk"
import { useQuery } from "@tanstack/react-query"
import directusStore from "~/store/directus"
import { SmallListCard, SmallListCardProps } from "../molecules/small"
import { FlatList } from "react-native"

export const sortFeatured = {
    featured: {
        _eq: true
    }
}

interface RenderType<T> {
    fields: string[],
    renderMethod: (props: T) => JSX.Element
}

export const bodies = {
    small: {
        fields: ["id", "title", "price", "location", "user_created.id", "user_created.avatar"],
        renderMethod: SmallListCard
    }
}

type ListCardProps = SmallListCardProps

export const RenderListings = ({ render, filter, horizontal }: { render: RenderType<ListCardProps>, filter?: typeof sortFeatured, horizontal?: boolean }) => {
    const { rest } = directusStore()
    const { data, isLoading } = useQuery({
        queryKey: ["Fetching Listings with fields: ", ...render.fields],
        queryFn: async () => await rest.request(readItems("listings", {
            fields: render.fields,
            limit: 5,
            sort: ["-date_created"],
            filter
        })),
    }) as { data: ListCardProps[], isLoading: boolean }
    return !isLoading &&
        <FlatList
            horizontal={horizontal}
            data={data}
            renderItem={({ item }) => render.renderMethod(item)}
        />
}