import { Query } from '@directus/sdk';
import { InfiniteData, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { SmallListingCardProps } from 'app/components/cards/atoms/small';
import { defaultLimit } from 'app/lib/constants';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import {
  ListingCardMetrics,
  SmallLocationCardProps,
  smallLocationFields,
} from 'app/lib/props';
import _ from 'lodash';

export const smallLocationsCardQuery = <T extends SmallLocationCardProps>(
  query: Query<any, T[]> = { limit: defaultLimit },
): UseInfiniteQueryOptions<
  {
    items: T[];
    page: number;
  },
  Error,
  InfiniteData<{
    items: T[];
    page: number;
  }>
> => {
  return {
    queryKey: ['small locations query', query],
    queryFn: ({ pageParam = 0 }) =>
      renderCardsQuery2<SmallLocationCardProps>(
        _.merge(
          {
            collection: 'rooms',
            fields: smallLocationFields,
            filter: {
              type: {
                _eq: 'group',
              },
            },
            limit: 15,
          },
          query,
        ),
      ).then((res) => ({
        items: res as T[],
        page: Number(pageParam),
      })),
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.items?.length < query.limit!) {
        return null;
      }
      return Number(lastPageParam) + 1;
    },
  };
};
