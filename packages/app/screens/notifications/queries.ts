import { Query } from '@directus/sdk';
import { UseInfiniteQueryOptions, InfiniteData } from '@tanstack/react-query';
import { MediumListingCardProps } from 'app/components/cards/atoms/medium';
import {
  commonFilters,
  CommonFilters,
} from 'app/components/cards/molecules/listings';
import { defaultLimit } from 'app/lib/constants';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import { mediumListingsFields } from 'app/lib/props';
import { Notification } from 'app/lib/types';
import userStore from 'app/store/user';
import _ from 'lodash';

export const notificationsQuery = <T extends Notification>(
  query?: Query<any, T[]>,
  id?: string,
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
  const limit = query?.limit ?? defaultLimit;
  const { user } = userStore.getState();

  return {
    queryKey: ['Fetch all the notifications', query],
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.items?.length < limit!) {
        return null;
      }
      return Number(lastPageParam) + 1;
    },
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      const offset = Number(pageParam) * limit!;

      const res = await renderCardsQuery2<Notification>(
        _.merge(
          {
            collection: 'notifications',
            limit,
            offset,
            sort: '-timestamp',
          },
          query,
        ),
      );

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
    enabled: true,
  };
};
