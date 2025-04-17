import { Query } from '@directus/sdk';
import { InfiniteData, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { SmallListingCardProps } from '../../components/cards/atoms/small';
import {
  CommonFilters,
  commonFilters,
} from '../../components/cards/molecules/listings';
import {
  ConfirmedAdvertisementCardProps,
  IS_AD_TYPE,
} from '../../components/cards/molecules2/listings';
import { defaultLimit } from '../../lib/constants';
import { renderCardsQuery2, getListingMetrics } from '../../lib/misc/queries';
import {
  ListingCardMetrics,
  mediumListingsFields,
  smallListingsFields,
} from '../../lib/props';
import * as _ from 'lodash';
import { MediumListingCardProps } from '../../components/cards/atoms/medium';

export const seenByMeListingsQuery = <
  T extends MediumListingCardProps & ListingCardMetrics,
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
  return {
    queryKey: ['activity screen seen by me listings small cards query', query],
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.items?.length < query.limit!) {
        return null;
      }
      return Number(lastPageParam) + 1;
    },
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const listingsLimit = query.limit!;
      const listingsOffset = Number(pageParam) * query.limit!;

      const listings = await renderCardsQuery2<MediumListingCardProps>(
        _.merge(
          {
            collection: 'listings',
            fields: mediumListingsFields,
            filter: commonFilters[CommonFilters.ViewedByMe](),
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

export const savedByMeListingsQuery = <
  T extends MediumListingCardProps & ListingCardMetrics,
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
  return {
    queryKey: ['activity screen saved by me listings small cards query', query],
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.items?.length < query.limit!) {
        return null;
      }
      return Number(lastPageParam) + 1;
    },
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const listingsLimit = query.limit!;
      const listingsOffset = Number(pageParam) * query.limit!;

      const listings = await renderCardsQuery2<MediumListingCardProps>(
        _.merge(
          {
            collection: 'listings',
            fields: mediumListingsFields,
            filter: commonFilters[CommonFilters.SavedByMe](),
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
