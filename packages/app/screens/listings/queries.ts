import { Query } from '@directus/sdk';
import { InfiniteData, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { AdvertisementCardProps } from 'app/components/cards/atoms/advertisements';
import { MediumListingCardProps } from 'app/components/cards/atoms/medium';
import { SmallListingCardProps } from 'app/components/cards/atoms/small';
import {
  CommonFilters,
  commonFilters,
} from 'app/components/cards/molecules/listings';
import {
  ConfirmedAdvertisementCardProps,
  IS_AD_TYPE,
} from 'app/components/cards/molecules2/listings';
import { defaultLimit } from 'app/lib/constants';
import { renderCardsQuery2, getListingMetrics } from 'app/lib/misc/queries';
import {
  ListingCardMetrics,
  mediumListingsFields,
  smallListingsFields,
} from 'app/lib/props';
import * as _ from 'lodash';

export const listingsScreenQuery = <
  T extends
    | (MediumListingCardProps & ListingCardMetrics)
    | ConfirmedAdvertisementCardProps,
>(
  query: Query<any, T[]>,
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
    queryKey: ['listings', 'listings screen query', query],
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.items?.length < query.limit!) {
        return null;
      }
      return Number(lastPageParam) + 1;
    },
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      if (!query.limit) query.limit = defaultLimit;

      const adsLimit = Math.ceil(query.limit! / 5);
      const adsOffset = Number(pageParam) * adsLimit;
      const listingsLimit = query.limit!;
      const listingsOffset = Number(pageParam) * query.limit!;

      const listings = await renderCardsQuery2<MediumListingCardProps>(
        _.merge(
          {
            collection: 'listings',
            fields: mediumListingsFields,
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

      const ads = await renderCardsQuery2<AdvertisementCardProps>({
        collection: 'advertisements',
        fields: [
          'id',
          'caption',
          'title',
          'photo',
          'featured',
          'link_to_open',
          'date_created',
          'user_created.id',
          'user_created.avatar',
          'user_created.first_name',
          'user_created.last_name',
          'user_created.email',
        ],
        filter: {
          isActive: {
            _eq: true,
          },
        },
        sort: ['-date_created'],
        limit: adsLimit,
        offset: adsOffset,
      }).then((res) => res.map((r) => ({ ...r, [IS_AD_TYPE]: true })));

      const res = mergeArraysRandomly(listings, ads) as T[];

      return {
        items: res as T[],
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
  };
};

export const premiumListingsSmallQuery = <
  T extends SmallListingCardProps & ListingCardMetrics,
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
    queryKey: [
      'listings',
      'home screen premium listings small cards query',
      query,
    ],
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

      const listings = await renderCardsQuery2<SmallListingCardProps>({
        collection: 'listings',
        fields: smallListingsFields,
        ...query,
        filter: commonFilters[CommonFilters.Premium](),
        limit: listingsLimit,
        offset: listingsOffset,
      }).then((res) =>
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

function mergeArraysRandomly<T1, T2>(array1: T1[], array2: T2[]): (T1 | T2)[] {
  const result: (T1 | T2)[] = [];
  let i = 0;
  let j = 0;

  if (array1.length > 0) {
    result.push(array1[i]!);
    i++;
  }

  while (i < array1.length && j < array2.length) {
    if (Math.random() < 0.5) {
      result.push(array1[i]!);
      i++;
    } else {
      result.push(array2[j]!);
      j++;
    }
  }

  while (j < array2.length) {
    result.push(array2[j]!);
    j++;
  }

  while (i < array1.length) {
    result.push(array1[i]!);
    i++;
  }

  return result;
}
