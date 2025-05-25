import { HorizontalFlatListProps } from '@idiosync/horizontal-flatlist/dist/horizontal-flat-list';
import { useQuery } from '@tanstack/react-query';
import { ViewAllButton } from 'app/components/utils/common-ui';
import { useRouter } from 'app/context/router';
import { FlatListProps, FlatList } from 'react-native';
import { Button } from 'app/components/ui/button';
import { NormalCardListProps } from './types';
import { HorizontalFlatList } from 'app/components/utils/virtual-lists';

export function NormalCardList<T extends { id: string }>({
  component: RenderComponent,
  skeletonComponent: SkeletonComponent,
  flatListProps,
  viewAllLink,
  numRows,
  skeletonCount,
  queryOptions,
}: NormalCardListProps<T>) {
  const { data, isLoading, isFetching } = useQuery(queryOptions);

  const flatListFinalProps: FlatListProps<T> | HorizontalFlatListProps<T> = {
    data: data ?? [],
    renderItem: ({ item }: { item: T }) => <RenderComponent {...item} />,
    keyExtractor: (item: T) => item.id,
    ListFooterComponent: (
      <NormalListFooterComponent
        horizontal={flatListProps?.horizontal ?? false}
        viewAllLink={viewAllLink}
      />
    ),
    ...flatListProps,
  };

  const skeletonLength =
    skeletonCount ?? [2, 2, 3][Math.floor(Math.random() * 3)];

  return isLoading || isFetching ? (
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

const NormalListFooterComponent = ({
  horizontal,
  viewAllLink,
}: {
  horizontal: boolean;
  viewAllLink?: string;
}) => {
  const router = useRouter();

  return viewAllLink ? (
    <ViewAllButton
      horizontal={horizontal}
      button={(props) => (
        <Button onPress={() => router.push(viewAllLink)} {...props} />
      )}
    />
  ) : (
    <></>
  );
};
