import { MediumUsersCard, SmallUsersCard, mediumUsersFields, smallUsersFields } from "../atoms/users"
import directusStore from "app/store/directus"
import { directusUrl } from "app/lib/constants"
import { ComponentType, useEffect, useState } from "react"
import { FlatList } from "app/components/utils/virtual-lists"
import { FlatListProps, View } from "react-native"
import { queryClient } from "app/store/query"
import { BottomLoader } from "./listings"
import { GoToUsersListButton } from "app/components/link-buttons"
import { ViewAllButton } from "app/components/utils/common-ui"
import { uniqBy } from "lodash"
import { useInfiniteQuery } from "@tanstack/react-query"

export enum Mode {
    small = "small",
    medium = "medium",
}

export enum CommonFilters {
    Location = "location",
    Company = "company",
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

export const RenderUsers = <R,>({ mode, limit = 5, sort = [], filter, searchText = "", infinite, flatListProps = {} }: { mode: Mode, limit?: number, filter?: Record<string, any>, sort?: string[], searchText?: string, infinite?: boolean, flatListProps?: Omit<FlatListProps<R>, "data" | "renderItem"> }) => {

    const { token } = directusStore()
    const { fields, renderMethod: Component } = bodies[mode]

    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<{ items: R[], page: unknown }>({
        queryKey: ["fetching users list", fields, filter, limit],
        queryFn: async ({ pageParam = 0 }) => {
            const url = `${directusUrl}/users/?fields=${fields.join(",")}&limit=${limit}&filter=${filter ? JSON.stringify(filter) : ""}&sort=${sort.join(",")}&offset=${Number(pageParam) * limit}&search=${searchText}`
            const res = await fetch(url, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then(res => res.json()).then(res => res.data) as R[]
            return {
                items: res as R[],
                page: pageParam
            }
        },
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.items.length < limit) return undefined
            else return Number(lastPageParam) + 1
        }
    })

    return <FlatList
        data={data?.pages.map(page => page.items).flat() ?? []}
        renderItem={({ item }) => <Component {...item} />}
        ItemSeparatorComponent={() => <View className="w-4 h-4" />}
        ListFooterComponent={infinite ? <BottomLoader endReached={!hasNextPage} onEndReached={fetchNextPage} /> : <ViewAllButton horizontal={!!flatListProps.horizontal}
            button={(props) => <GoToUsersListButton {...props} />}
        />}
        {...flatListProps}
    />
}