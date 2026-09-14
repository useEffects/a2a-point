import { Query } from '@directus/sdk';
import {
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from '@tanstack/react-query';

type QueryOptsArgs<T> = {
  queryOptions?: UseQueryOptions<T[]> | UseInfiniteQueryOptions<T[]>;
  query?: Query<any, T[]>;
};

export interface QueryOptsInstance<T = any> {
  get: () => UseQueryOptions<T[]> | UseInfiniteQueryOptions<T[]>;
}

export type QueryOpts<T = any> = new (
  args?: QueryOptsArgs<T> | never,
) => QueryOptsInstance<T>;

export function Prefetchable<T extends QueryOpts>() {
  return function (target: T) {
    prefetchableQueryOpts.push(target);
  };
}

export const prefetchableQueryOpts: QueryOpts[] = [];
