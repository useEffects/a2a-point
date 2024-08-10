import { Query } from "@directus/sdk"
import { useMemo } from "react"
import { FlatList } from "./utils/virtual-lists"
import { FlatListProps, Platform } from "react-native"
import { BottomLoader } from "./cards/molecules/listings"
import { ViewAllButton } from "./utils/common-ui"
import { useRouter } from "app/hooks/router"
import { Button } from "./ui/button"
import { useInfiniteQuery } from "@tanstack/react-query"
import { uniqBy } from "lodash"
import { defaultLimit } from "app/lib/constants"

interface InfiniteListProps<T> {
    component: React.ComponentType<{ item: T }>
    queryKey: any[]
    queryFn: (limit: number, page: number) => Promise<T[]>
    initialItems: T[]
    apiOptions?: Query<any, T>
    infinite?: boolean
    flatListProps?: Omit<FlatListProps<T>, "data" | "renderItem">
}

export default function InfiniteList<T>(props: InfiniteListProps<T>) {
    const { component: RenderComponent, queryKey, queryFn, initialItems, apiOptions = {}, infinite = false, flatListProps } = props;
    const { limit = defaultLimit } = apiOptions;

    const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<{ items: T[], page: number }>({
        initialPageParam: 0,
        getNextPageParam: (lastPage, allPages, lastPageParam) => {
            if (lastPage.items.length < limit) {
                return null;
            }
            return Number(lastPageParam) + 1;
        },
        queryKey: queryKey,
        queryFn: async ({ pageParam = 0 }) => {
            const page = Number(pageParam);
            return await queryFn(limit, page).then(res => ({
                items: res,
                page: page,
            }));
        },
        initialData: {
            pages: [{ items: initialItems, page: 0 }],
            pageParams: [0],
        },
        enabled: infinite,
    });

    const finalData = useMemo(() => {
        return uniqBy(
            data?.pages.reduce((acc, page) => acc.concat(page.items), [] as T[]),
            "id"
        );
    }, [data]);

    const handleEndReached = () => {
        if (hasNextPage) {
            fetchNextPage();
        }
    }

    const List = useMemo(
        () =>
            withEndReached<T>({
                onEndReached: handleEndReached,
                endReached: !hasNextPage,
                infinite: infinite,
                horizontal: !!flatListProps?.horizontal,
                viewAllLink: "",
            }),
        [hasNextPage, infinite, flatListProps?.horizontal]
    );

    return (
        <List
            data={finalData}
            renderItem={({ item }) => <RenderComponent item={item} />}
            // @ts-expect-error id is not in T
            keyExtractor={(item) => (item).id}
            {...flatListProps}
        />
    );
}

const withEndReached = <T,>({ onEndReached, endReached, infinite, horizontal, viewAllLink }: { onEndReached: () => void, endReached: boolean, infinite: boolean, horizontal: boolean, viewAllLink: string }) => {
    const isWeb = Platform.OS === "web"
    return (props: FlatListProps<T>) => <FlatList
        {...props}
        onEndReached={() => !isWeb && onEndReached()}
        ListFooterComponent={() => {
            const router = useRouter()
            return infinite ? <BottomLoader endReached={endReached} onEndReached={() => isWeb && onEndReached()} /> :
                <ViewAllButton horizontal={horizontal} button={(props) => <Button onPress={() => router.push(viewAllLink)} {...props} />} />
        }
        }
    />
}