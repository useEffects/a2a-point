import { InfiniteCardList } from './infinite-list';
import { NormalCardList } from './normal-list';
import { InfiniteListProps, NormalCardListProps } from './types';

export function CardList<T extends { id: string }>(
  props: InfiniteListProps<T> | NormalCardListProps<T>,
) {
  const isInfinite = 'infiniteQueryOptions' in props;

  return isInfinite ? (
    <InfiniteCardList {...(props as InfiniteListProps<T>)} />
  ) : (
    <NormalCardList {...(props as NormalCardListProps<T>)} />
  );
}
