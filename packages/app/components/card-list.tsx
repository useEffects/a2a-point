import React, { ReactNode, useEffect, useMemo } from "react"
import { FlatList, ScrollView } from "./utils/virtual-lists"
import { FlatListProps, Platform } from "react-native"
import { useInfiniteQuery, useQuery } from "@tanstack/react-query"
import { queryClient } from "app/store/query"
import { renderCardsQuery } from "app/lib/misc/queries"

interface CardListProps<CardFields> {
    collection: string,
    initialData: CardFields[],
    component: React.FC<CardFields>
    infiniteScroll?: boolean,
    avoidInitialData?: boolean,
    flatlistProps: Omit<FlatListProps<CardFields>, 'data' | 'renderItem'>,
    directusAPIOptions: {
        limit?: number,
        search?: string,
        sort?: string[],
        filter?: Record<string, any>,
        deep?: Record<string, any>
    }
}

export const CardList = <CardFields,>
    ({
        collection,
        initialData,
        component: Component,
        infiniteScroll = false,
        avoidInitialData = false,
        flatlistProps,
        directusAPIOptions
    }: CardListProps<CardFields>) => {


    const { limit = 10, search: searchText = "", sort = [], filter = {}, deep = {} } = directusAPIOptions
    const shouldUseInitialData = !avoidInitialData && infiniteScroll
    const initialPageParam = shouldUseInitialData ? 1 : 0
    const queryKey = ["Card list", collection, directusAPIOptions, shouldUseInitialData]

    const finalInitialData = {
        pages: [initialData],
        pageParams: [0]
    }

    const { data, hasNextPage, fetchNextPage, isFetchingNextPage } = useInfiniteQuery({
        initialPageParam,
        queryKey,
        queryFn: async ({ pageParam = initialPageParam }) => await renderCardsQuery<CardFields>(
            { collection, limit, searchText, sort, filter, deep, offset: pageParam * limit }
        ),
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === limit ? allPages.length + 1 : undefined
        },
        enabled: !shouldUseInitialData
    })

    useEffect(() => {
        queryClient.setQueryData(queryKey, (data) => {
            return shouldUseInitialData ? finalInitialData : data
        })
    }, [shouldUseInitialData])

    return <ScrollEndDetectable
        onScrollEnd={fetchNextPage}
        shouldDetect={infiniteScroll && hasNextPage}
    >
        <FlatList<CardFields>
            data={data?.pages.flat() || []}
            renderItem={({ item, index }) => <Component {...item} key={index} />}
            {...flatlistProps}
        />
    </ScrollEndDetectable>
}

const ScrollEndDetectable = ({ children, onScrollEnd, shouldDetect }: { children: ReactNode, onScrollEnd: () => void, shouldDetect: boolean }) => {
    return shouldDetect ? Platform.select({
        web: <ScrollView contentContainerClassName="flex-1">
            {children}
        </ScrollView>,
        native: <ScrollView contentContainerClassName="flex-1">
            {children}
        </ScrollView>,
        default: <></>
    }) : children
}