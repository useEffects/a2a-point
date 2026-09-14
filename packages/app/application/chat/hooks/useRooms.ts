import {
  InfiniteData,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import {
  fetchLimit,
  roomsSubscribedQueryKey,
  roomSubscribedFields,
} from '../utils';
import { directusStore } from 'app/store/directus';
import { useAuthFlow } from 'app/application/auth/hooks';
import { createItem, Query } from '@directus/sdk';
import userStore from 'app/store/user';
import { RoomSubscribed } from '../types';
import { Room } from 'app/lib/types';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import { defaultLimit } from 'app/lib/constants';

export const useRooms = (roomsQuery: Query<any, RoomSubscribed> = {}) => {
  const { rest } = directusStore();
  const { user } = userStore();
  const {
    data: { isAuthenticated },
  } = useAuthFlow();
  const queryClient = useQueryClient();

  const roomsSubscribedQueryData = useInfiniteQuery({
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
        offset: defaultLimit * pageParam,
        limit: defaultLimit,
        ...roomsQuery,
      });
      return roomsSubscribed as RoomSubscribed[];
    },
    getNextPageParam: (lastPage, allPages, lastPageParam) => {
      if (lastPage.length < fetchLimit) {
        return null;
      }
      return Number(lastPageParam) + 1;
    },
    initialPageParam: 0,
    initialData: {
      pageParams: [],
      pages: [],
    },
    enabled: isAuthenticated,
  });

  const addRoomsSubscribedMutation = useMutation({
    mutationKey: ['ADD ROOM MUTATION'],
    mutationFn: async (roomToCreate: Room) =>
      rest.request(
        createItem('room', roomToCreate, {
          fields: roomSubscribedFields,
        }),
      ) as Promise<RoomSubscribed>,
    onSuccess: (newRoomSubscribed: RoomSubscribed) => {
      queryClient.setQueryData(
        roomsSubscribedQueryKey,
        (data: InfiniteData<RoomSubscribed[]>) => {
          data.pages[data.pages.length - 1]?.push(newRoomSubscribed);

          return data;
        },
      );
    },
  });

  return { roomsSubscribedQueryData, addRoomsSubscribedMutation };
};
