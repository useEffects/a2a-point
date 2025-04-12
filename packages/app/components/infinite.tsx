import { Query } from '@directus/sdk';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useRouter } from 'app/hooks/router';
import { defaultLimit } from 'app/lib/constants';
import { cloneDeep, uniqBy } from 'lodash';
import { Key, useEffect, useMemo } from 'react';
import { FlatListProps, Platform } from 'react-native';
import { FlatList } from './utils/virtual-lists';
import { BottomLoader } from './cards/molecules/listings';
import { Button } from './ui/button';
import { ViewAllButton } from './utils/common-ui';

export type queryFnType<T> = (apiOptions: Query<any, T>) => Promise<T[]>;

interface InfiniteListProps<T> {
  component: React.FC<T>;
  queryKey: any[];
  queryFn: queryFnType<T>;
  queryFnArgs: Query<any, T>;
  initialItems: T[];
  skeletonComponent: React.FC<{}>;
  infinite?: boolean;
  flatListProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>;
  viewAllLink?: string;
}

export default function InfiniteList<
  T extends JSX.IntrinsicAttributes & { id: string },
>(props: InfiniteListProps<T>) {
  const {
    component: RenderComponent,
    queryKey,
    queryFn,
    initialItems,
    skeletonComponent: SkeletonComponent,
    infinite = false,
    flatListProps,
    viewAllLink,
    queryFnArgs = {},
  } = props;
  const { limit = defaultLimit } = queryFnArgs;

  const { data, fetchNextPage, hasNextPage, isLoading, isFetching, isPending } =
    useInfiniteQuery<{
      items: T[];
      page: unknown;
    }>({
      initialPageParam: 0,
      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        if (!lastPage.items.length || lastPage.items.length < limit) {
          return null;
        }
        return Number(lastPageParam) + 1;
      },
      queryKey: cloneDeep(queryKey),
      queryFn: async ({ pageParam = 0 }) => {
        const res = await queryFn({
          ...queryFnArgs,
          offset: Number(pageParam) * limit,
        });
        return {
          items: res,
          page: pageParam,
        };
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
      'id',
    );
  }, [data]);

  const handleEndReached = () => {
    if (hasNextPage) {
      fetchNextPage();
    }
  };

  return isFetching ? (
    <FlatList
      data={Array([2, 2, 3][Math.floor(Math.random() * 3)])}
      renderItem={() => <SkeletonComponent />}
      {...flatListProps}
    />
  ) : (
    <FlatList
      data={finalData}
      renderItem={({ item }) => <RenderComponent {...item} />}
      keyExtractor={(item) => item.id}
      onEndReached={() => !isWeb && handleEndReached()}
      ListFooterComponent={
        <ListFooterComponent
          infinite={infinite}
          endReached={!hasNextPage}
          onEndReached={handleEndReached}
          horizontal={flatListProps?.horizontal ?? false}
          viewAllLink={viewAllLink}
        />
      }
      {...flatListProps}
    />
  );
}

const ListFooterComponent = ({
  infinite,
  endReached,
  onEndReached,
  horizontal,
  viewAllLink,
}: {
  infinite: boolean;
  endReached: boolean;
  onEndReached: () => void;
  horizontal: boolean;
  viewAllLink?: string;
}) => {
  const router = useRouter();

  if (!infinite && !viewAllLink) {
    throw new Error('viewAllLink is required when infinite is true');
  }

  return infinite ? (
    <BottomLoader
      endReached={endReached}
      onEndReached={() => isWeb && onEndReached()}
    />
  ) : (
    <ViewAllButton
      horizontal={horizontal}
      button={(props) => (
        <Button onPress={() => router.push(viewAllLink!)} {...props} />
      )}
    />
  );
};

const isWeb = Platform.OS === 'web';
