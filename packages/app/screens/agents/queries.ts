import { Query } from '@directus/sdk';
import { InfiniteData, UseInfiniteQueryOptions } from '@tanstack/react-query';
import { defaultLimit, memberRole } from 'app/lib/constants';
import {
  getFeedbacksCountForUser,
  getListingsCountForUser,
  renderCardsQuery2,
} from 'app/lib/misc/queries';
import {
  SmallUsersCardProps,
  smallUsersFields,
  UsersCardMetrics,
} from 'app/lib/props';
import _ from 'lodash';

export const smallUsersQuery = <
  T extends SmallUsersCardProps & UsersCardMetrics,
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
    queryKey: ['small users query', query],
    queryFn: ({ pageParam = 0 }) =>
      renderCardsQuery2<SmallUsersCardProps>(
        _.merge(
          {
            collection: 'users',
            fields: smallUsersFields,
            filter: {
              role: {
                _eq: memberRole,
              },
            },
            limit: 5,
          },
          query,
        ),
      )
        .then((res) =>
          Promise.all(
            res.map(async (user) => {
              const listingsCount = await getListingsCountForUser(user.id);
              const ratingsCount = await getFeedbacksCountForUser(user.id);
              return { ...user, listingsCount, ratingsCount };
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
