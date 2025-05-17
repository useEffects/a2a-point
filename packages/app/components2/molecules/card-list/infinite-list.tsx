import { HorizontalFlatListProps } from '@idiosync/horizontal-flatlist/dist/horizontal-flat-list';
import { useInfiniteQuery } from '@tanstack/react-query';
import { uniqBy } from 'lodash';
import { useMemo, useCallback } from 'react';
import { FlatListProps, FlatList, View } from 'react-native';
import { useIntersectionObserver } from 'app/hooks/intersection-observer';
import { BottomLoader } from 'app/components/cards/molecules/listings';
import { InfiniteListProps } from './types';

export function InfiniteCardList<T extends { id: string }>({
  component: RenderComponent,
  skeletonComponent: SkeletonComponent,
  flatListProps,
  numRows,
  skeletonCount,
  infiniteQueryOptions,
}: InfiniteListProps<T>) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isFetching } =
    useInfiniteQuery(infiniteQueryOptions);

  const finalData = useMemo(() => {
    return uniqBy(data ?? [], 'id');
  }, [data]);

  const handleEndReached = useCallback(() => {
    if (hasNextPage) fetchNextPage();
  }, [hasNextPage, fetchNextPage]);

  const flatListFinalProps: FlatListProps<T> | HorizontalFlatListProps<T> =
    useMemo(
      () => ({
        data: finalData,
        renderItem: ({ item }: { item: T }) => <RenderComponent {...item} />,
        keyExtractor: (item: T) => item.id,
        ListFooterComponent: (
          <InfiniteListFooterComponent
            endReached={!hasNextPage}
            onEndReached={handleEndReached}
          />
        ),
        ...flatListProps,
      }),
      [finalData, handleEndReached, hasNextPage],
    );

  const skeletonLength =
    skeletonCount ?? [2, 2, 3][Math.floor(Math.random() * 3)];

  return isFetching && !isFetchingNextPage ? (
    <FlatList
      data={Array(skeletonLength).fill(null)}
      renderItem={() => <SkeletonComponent />}
      keyExtractor={(_, index) => index.toString()}
      {...flatListProps}
    />
  ) : flatListProps?.horizontal ? (
    // @ts-ignore
    <HorizontalFlatList<T>
      numRows={numRows ?? 1}
      {...flatListFinalProps}
      columnStyle={{ gap: 16 }}
    />
  ) : (
    <FlatList {...flatListFinalProps} />
  );
}

const InfiniteListFooterComponent = ({
  endReached,
  onEndReached,
}: {
  endReached: boolean;
  onEndReached: () => void;
}) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.2 });

  return (
    <View ref={ref}>
      <BottomLoader
        endReached={endReached}
        onEndReached={() => isVisible && onEndReached()}
      />
    </View>
  );
};
