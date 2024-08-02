"use client"

import { MediumUsersCard, SmallUsersCard } from "../atoms/users"
import { ComponentType, useMemo, useState } from "react"
import { FlatList } from "app/components/utils/virtual-lists"
import { FlatListProps, Platform, View } from "react-native"
import { BottomLoader } from "./listings"
import { ViewAllButton } from "app/components/utils/common-ui"
import { useInfiniteQuery } from "@tanstack/react-query"
import useRouting from "app/hooks/use-routing"
import { Button } from "app/components/ui/button"
import { mediumUsersFields, smallUsersFields, UsersCardMetrics } from "app/lib/props"
import { renderCardsQuery } from "app/lib/misc/queries"
import { uniqBy } from "lodash"
import { memberRole } from "app/lib/constants"

export enum Mode {
    small = "small",
    medium = "medium",
}

export enum CommonFilters {
    Location = "location",
    Company = "company",
}

export const mediumUserBody = {
    fields: mediumUsersFields,
    renderMethod: MediumUsersCard
}

const bodies = {
    small: {
        fields: smallUsersFields,
        renderMethod: SmallUsersCard
    },
    medium: {
        fields: mediumUsersFields,
        renderMethod: MediumUsersCard
    }
} as {
        [key in Mode]: {
            fields: string[],
            renderMethod: ComponentType<any>
        }
    }

const commonFilters = {
    [CommonFilters.Company]: (company: string) => ({
        company: {
            _eq: company
        }
    })
}

export type RenderUserProps<R> = {
    mode: Mode | "small" | "medium",
    initialData: (R & UsersCardMetrics)[],
    showInitialData?: boolean,
    limit?: number,
    filter?: Record<string, any>,
    sort?: string[], searchText?: string,
    infinite?: boolean,
    flatListProps?: Omit<FlatListProps<R>, "data" | "renderItem">,
}

export const RenderUsers = <R,>({
    mode,
    initialData,
    limit = 5,
    sort = [],
    filter = {
        role: {
            _eq: memberRole
        }
    },
    searchText = "",
    infinite,
    flatListProps = {},
}: RenderUserProps<R>) => {

    const { fields, renderMethod: Component } = bodies[mode]
    const goToUsersList = useRouting("users-list")
    const [startedScrolling, setStartedScrolling] = useState(false)

    const shouldUseInitialData = infinite && initialData.length && !Boolean(searchText || filter)

    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<{ items: R[], page: unknown }>({
        initialPageParam: shouldUseInitialData ? 1 : 0,
        queryKey: ["fetching users list", fields, filter, limit, searchText, shouldUseInitialData],
        queryFn: async ({ pageParam }) => renderCardsQuery<R>({
            collection: "users",
            fields,
            filter,
            sort,
            limit,
            offset: Number(pageParam) * limit,
            searchText
        }).then(res => ({ items: res, page: pageParam })),
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.items.length < limit) return undefined
            else return Number(lastPageParam) + 1
        },
        enabled: startedScrolling && infinite && !shouldUseInitialData
    })

    const items = data?.pages.map(page => page.items).flat() ?? []

    const finalData = useMemo(() => {
        if (!infinite) return initialData
        if (shouldUseInitialData) {
            if (startedScrolling) return [...initialData, ...items]
            else return initialData
        }
        else {
            return items
        }

    }, [data, initialData, startedScrolling, shouldUseInitialData, infinite])

    const onEndReached = () => {
        setStartedScrolling(true)
        fetchNextPage()
    }

    return <FlatList
        data={uniqBy(finalData, "id")}
        renderItem={({ item }) => <Component {...item} />}
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        onEndReached={() => Platform.OS !== "web" && infinite && onEndReached()}
        ListFooterComponent={infinite ? <BottomLoader endReached={!hasNextPage} onEndReached={() => Platform.OS === "web" && onEndReached()} /> : <ViewAllButton horizontal={!!flatListProps.horizontal}
            button={(props) => <Button onPress={() => goToUsersList("")} {...props} />}
        />}
        {...flatListProps}
    />
}