import { Query } from '@directus/sdk';
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryOptions,
} from '@tanstack/react-query';
import { useRouter } from 'app/hooks/router';
import { uniqBy } from 'lodash';
import { useCallback, useMemo, useState } from 'react';
import { FlatListProps, Platform, View } from 'react-native';
import { FlatList, HorizontalFlatList } from './utils/virtual-lists';
import { BottomLoader } from './cards/molecules/listings';
import { Button } from './ui/button';
import { ViewAllButton } from './utils/common-ui';
import { HorizontalFlatListProps } from '@idiosync/horizontal-flatlist/dist/horizontal-flat-list';
import { useIntersectionObserver } from 'app/hooks/intersection-observer';

export type queryFnType<T> = (apiOptions: Query<any, T>) => Promise<T[]>;

interface InfiniteListProps<T> {
  component: React.FC<T>;
  infiniteQueryOptions: UseInfiniteQueryOptions<
    {
      items: T[];
      page: number;
    },
    Error,
    InfiniteData<{
      items: T[];
      page: number;
    }>
  >;
  skeletonComponent: React.FC<{}>;
  infinite?: boolean;
  flatListProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>;
  numRows?: number;
  viewAllLink?: string;
  skeletonCount?: number;
}

export default function InfiniteList<
  T extends JSX.IntrinsicAttributes & { id: string },
>(props: InfiniteListProps<T>) {
  const {
    component: RenderComponent,
    skeletonComponent: SkeletonComponent,
    infiniteQueryOptions,
    infinite = false,
    flatListProps,
    viewAllLink,
  } = props;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetchingNextPage,
    isFetching,
  } = useInfiniteQuery(infiniteQueryOptions);

  const finalData = useMemo(() => {
    return uniqBy(
      data?.pages
        .reduce((acc, page) => acc.concat(page.items), [] as T[])
        .filter((d) => d && 'id' in d),
      'id',
    );
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage && infinite) {
      fetchNextPage();
    }
  }, [infinite, hasNextPage, fetchNextPage]);

  const flatListFinalProps: FlatListProps<T> | HorizontalFlatListProps<T> =
    useMemo(
      () => ({
        data: finalData,
        renderItem: ({ item }: { item: T }) => <RenderComponent {...item} />,
        keyExtractor: (item: T) => item.id,
        ListFooterComponent: (
          <ListFooterComponent
            infinite={infinite}
            endReached={!hasNextPage}
            onEndReached={handleEndReached}
            horizontal={flatListProps?.horizontal ?? false}
            viewAllLink={viewAllLink}
          />
        ),
        ...flatListProps,
      }),
      [finalData, handleEndReached, infinite, hasNextPage],
    );

  return isFetching && !isFetchingNextPage ? (
    <FlatList
      data={Array(
        props.skeletonCount ?? [2, 2, 3][Math.floor(Math.random() * 3)],
      )}
      renderItem={() => <SkeletonComponent />}
      {...flatListProps}
    />
  ) : flatListProps?.horizontal ? (
    // @ts-ignore
    <HorizontalFlatList<T>
      numRows={props.numRows ?? 1}
      {...flatListFinalProps}
      columnStyle={{
        gap: 16,
      }}
    />
  ) : (
    <FlatList {...flatListFinalProps} />
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
    throw new Error('viewAllLink is required when infinite is false');
  }

  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return infinite ? (
    <View ref={ref}>
      <BottomLoader
        endReached={endReached}
        onEndReached={() => isVisible && onEndReached()}
      />
    </View>
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
