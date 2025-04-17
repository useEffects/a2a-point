import { Query } from '@directus/sdk';
import { InfiniteData, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { MediumListingCardProps } from 'app/components/cards/atoms/medium';
import { SmallListingCardProps } from 'app/components/cards/atoms/small';
import {
  commonFilters,
  CommonFilters,
} from 'app/components/cards/molecules/listings';
import { defaultLimit } from 'app/lib/constants';
import {
  getListingMetrics,
  getListingsCountForLocation,
  getMembersCountForLocation,
  getUsersCount,
  renderCardsQuery2,
} from 'app/lib/misc/queries';
import {
  ListingCardMetrics,
  LocationCardMetrics,
  mediumListingsFields,
  MediumLocationCardProps,
  mediumLocationFields,
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

export const mediumLocationsCardQuery = <
  T extends MediumLocationCardProps & LocationCardMetrics,
>(
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
  if (!query.limit) query.limit = 15;
  return {
    queryKey: ['medium locations query', query],
    queryFn: ({ pageParam = 0 }) =>
      renderCardsQuery2<MediumLocationCardProps>(
        _.merge(
          {
            collection: 'rooms',
            fields: mediumLocationFields,
            filter: {
              type: {
                _eq: 'group',
              },
            },
            limit: query.limit,
            offset: Number(pageParam) * query.limit!,
          },
          query,
        ),
      )
        .then((res) =>
          Promise.all(
            res.map(async (r) => {
              const listingsCount = await getListingsCountForLocation(r.id);
              const membersCount = await getMembersCountForLocation(r.id);
              return { ...r, listingsCount, membersCount };
            }),
          ),
        )
        .then((res) => ({
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

export const mediumListingsForGivenLocation = <
  T extends MediumListingCardProps & ListingCardMetrics,
>(
  query: Query<any, T[]> = { limit: defaultLimit },
  id: string,
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
    queryKey: ['medium listings for a given location', query],
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.items?.length < query.limit!) {
        return null;
      }
      return Number(lastPageParam) + 1;
    },
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      if (!query.limit) query.limit = defaultLimit;

      const listingsLimit = query.limit;
      const listingsOffset = Number(pageParam) * query.limit!;

      const listings = await renderCardsQuery2<MediumListingCardProps>(
        _.merge(
          {
            collection: 'listings',
            fields: mediumListingsFields,
            filter: commonFilters[CommonFilters.GroupId](id),
            limit: listingsLimit,
            offset: listingsOffset,
          },
          query,
        ),
      ).then((res) =>
        Promise.all(
          res.map(async (r) => {
            const metrics = await getListingMetrics(r.id);
            return { ...r, ...metrics };
          }),
        ),
      );

      return {
        items: listings as T[],
        page: Number(pageParam),
      };
    },
    initialData: {
      pageParams: [0],
      pages: [
        {
          items: [],
          page: 0,
        },
      ],
    },
    enabled: true,
  };
};
