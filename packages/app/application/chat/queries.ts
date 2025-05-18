import { defaultLimit } from 'app/lib/constants';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import { RoomSubscribed } from './types';
import {
  roomsSubscribedQueryKey,
  roomSubscribedFields,
  fetchLimit,
} from './utils';
import userStore from 'app/store/user';
import { Query } from '@directus/sdk';
import { UseInfiniteQueryOptions } from '@tanstack/react-query';
import { merge } from 'lodash';

export const createRoomsSubscribedQOpts = ({
  queryOptions = {},
  query = {},
}: {
  queryOptions?: Omit<
    UseInfiniteQueryOptions<RoomSubscribed[]>,
    'queryKey' | 'getNextPageParam' | 'initialPageParam'
  >;
  query?: Query<any, RoomSubscribed>;
}) => {
  const { user } = userStore.getState();

  return merge(
    {
      queryKey: roomsSubscribedQueryKey,
      queryFn: async ({ pageParam = 0 }) => {
        const roomsSubscribed = await renderCardsQuery2<RoomSubscribed>({
          collection: 'rooms',
          filter: {
            members: {
              directus_users_id: {
                _eq: user.id,
              },
            },
          },
          fields: roomSubscribedFields,
          offset: defaultLimit * Number(pageParam),
          limit: defaultLimit,
          ...query,
        });
        return roomsSubscribed;
      },
      getNextPageParam: (lastPage, _allPages, lastPageParam) => {
        if (lastPage.length < fetchLimit) {
          return null;
        }
        return Number(lastPageParam) + 1;
      },
      initialPageParam: 0,
      initialData: {
        pages: [],
        pageParams: [],
      },
    } as UseInfiniteQueryOptions<RoomSubscribed[]>,
    queryOptions,
  );
};
