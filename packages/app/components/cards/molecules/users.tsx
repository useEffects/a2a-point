"use client"

import { useInfiniteQuery } from "@tanstack/react-query"
import { Button } from "app/components/ui/button"
import { ViewAllButton } from "app/components/utils/common-ui"
import { FlatList } from "app/components/utils/virtual-lists"
import { useRouter } from "app/hooks/router"
import { memberRole } from "app/lib/constants"
import { renderCardsQuery } from "app/lib/misc/queries"
import { mediumUsersFields, smallUsersFields, UsersCardMetrics } from "app/lib/props"
import { uniqBy } from "lodash"
import { ComponentType, useCallback, useMemo, useState } from "react"
import { FlatListProps, Platform, View } from "react-native"
import { MediumUsersCard, SmallUsersCard } from "../atoms/users"
import { BottomLoader } from "./listings"

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

    const { fields, renderMethod: Component } = bodies[mode];
    const router = useRouter();

    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<{ items: R[], page: unknown }>({
        initialPageParam: 0,
        queryKey: ["fetching users list", fields, filter, limit, searchText],
        queryFn: async ({ pageParam }) => renderCardsQuery<R>({
            collection: "users",
            fields,
            filter,
            sort,
            limit,
            offset: Number(pageParam) * limit,
            searchText
        }).then(res => ({ items: res, page: pageParam })),
        getNextPageParam: (lastPage) => {
            return lastPage.items.length < limit ? undefined : Number(lastPage.page) + 1;
        },
        enabled: infinite,
    });

    const finalData = useMemo(() => {
        if (infinite && data?.pages) {
            const items = data.pages.map(page => page.items).flat();
            return uniqBy(items, "id");
        }
        return initialData;
    }, [data?.pages, initialData, infinite]);

    const onEndReached = useCallback(() => {
        if (hasNextPage) fetchNextPage();
    }, [hasNextPage]);

    const renderItem = useCallback(({ item }: { item: R }) => <Component {...item} />, [Component]);

    // @ts-expect-error id is not in R
    const keyExtractor = useCallback((item: R) => item.id, []);

    const ListFooter = useCallback(() => {
        return infinite
            ? <BottomLoader endReached={!hasNextPage} onEndReached={() => Platform.OS === "web" && onEndReached()} />
            : <ViewAllButton
                horizontal={!!flatListProps.horizontal}
                button={(props) => <Button onPress={() => router.push("/agents")} {...props} />}
            />;
    }, [infinite, hasNextPage]);

    return (
        <FlatList
            data={finalData}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            ItemSeparatorComponent={() => <View className="w-4 h-4" />}
            onEndReached={() => Platform.OS !== "web" && infinite && onEndReached()}
            ListFooterComponent={ListFooter}
            {...flatListProps}
        />
    );
};
