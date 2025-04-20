import { Query } from '@directus/sdk';
import {
  InfiniteData,
  UseInfiniteQueryOptions,
  UseQueryOptions,
} from '@tanstack/react-query';
import { PhotoListingProps } from 'app/components/cards/atoms/photo';
import {
  commonFilters,
  CommonFilters,
} from 'app/components/cards/molecules/listings';
import { defaultLimit } from 'app/lib/constants';
import {
  getCompaniesWithAgents,
  getListingsCount,
  getLocationsCount,
  getUsersCount,
  renderCardsQuery2,
} from 'app/lib/misc/queries';
import { photoListingsFields } from 'app/lib/props';
import { NewsProps } from 'app/lib/types';

export const photoHistoryListingsQuery = <T = PhotoListingProps>(
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
> => ({
  queryKey: ['listings', 'history listings for current user', query],
  queryFn: async ({ pageParam = 0 }) =>
    await renderCardsQuery2<PhotoListingProps>({
      collection: 'listings',
      fields: photoListingsFields,
      filter: commonFilters[CommonFilters.ViewedByMe](),
      limit: query.limit!,
      offset: Number(pageParam) * query.limit!,
    }).then((res) => ({
      items: res as T[],
      page: Number(pageParam),
    })),
  getNextPageParam: (lastPage, allPages, lastPageParam) => {
    if (lastPage.items?.length < query.limit!) {
      return null;
    }
    return Number(lastPageParam) + 1;
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
  initialPageParam: 0,
  enabled: true,
});

export const photoListingsQuery = <T = PhotoListingProps>(
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
> => ({
  queryKey: ['listings', 'photo listings for user', query],
  queryFn: async ({ pageParam = 0 }) =>
    await renderCardsQuery2<PhotoListingProps>({
      collection: 'listings',
      fields: photoListingsFields,
      filter: commonFilters[CommonFilters.Photo](),
      limit: query.limit!,
      offset: Number(pageParam) * query.limit!,
    }).then((res) => ({
      items: res as T[],
      page: Number(pageParam),
    })),
  getNextPageParam: (lastPage, allPages, lastPageParam) => {
    if (lastPage.items?.length < query.limit!) {
      return null;
    }
    return Number(lastPageParam) + 1;
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
  initialPageParam: 0,
  enabled: true,
});

export const companyStatsQuery: UseQueryOptions<{
  listingsCount: number;
  usersCount: number;
  locationsCount: number;
  companiesCount: number;
}> = {
  queryKey: ['Fetch counts and stats'],
  queryFn: async () =>
    await Promise.all([
      getListingsCount(),
      getUsersCount(),
      getLocationsCount(),
      getCompaniesWithAgents(),
    ]).then(([listingsCount, usersCount, locationsCount, companiesCount]) => ({
      listingsCount,
      usersCount,
      locationsCount,
      companiesCount,
    })),
  initialData: {
    listingsCount: 0,
    usersCount: 0,
    locationsCount: 0,
    companiesCount: 0,
  },
};

export const newsQuery = <T = NewsProps>(
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
> => ({
  queryKey: ['news', 'fetch news and feed', query],
  queryFn: async ({ pageParam = 0 }) =>
    await renderCardsQuery2<NewsProps>({
      collection: 'news',
      limit: query.limit!,
      offset: Number(pageParam) * query.limit!,
    }).then((res) => ({
      items: res as T[],
      page: Number(pageParam),
    })),
  getNextPageParam: (lastPage, allPages, lastPageParam) => {
    if (lastPage.items?.length < query.limit!) {
      return null;
    }
    return Number(lastPageParam) + 1;
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
  initialPageParam: 0,
  enabled: true,
});
