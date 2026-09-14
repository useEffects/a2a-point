import {
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { FlatListProps } from 'react-native';

export type BaseProps<T> = {
  component: React.FC<T>;
  skeletonComponent: React.FC<{}>;
  flatListProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>;
  numRows?: number;
  viewAllLink?: string;
  skeletonCount?: number;
};

export type InfiniteListProps<T> = BaseProps<T> & {
  infiniteQueryOptions: UseInfiniteQueryOptions<T[]>;
  queryOptions?: never;
};

export type NormalCardListProps<T> = BaseProps<T> & {
  queryOptions: UseQueryOptions<T[]>;
  infiniteQueryOptions?: never;
  noMoreClassName?: string;
};
