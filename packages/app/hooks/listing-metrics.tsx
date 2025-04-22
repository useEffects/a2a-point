import {
  aggregate,
  createItem,
  createNotification,
  deleteItem,
  deleteItems,
  readItems,
} from '@directus/sdk';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { directusStore } from 'app/store/directus';
import userStore from 'app/store/user';
import { Listing, User } from 'app/lib/types';

const checkSavesKey = (listingId: string) => ['check-saved', listingId];

export type UserCount = { count: { directus_users_id: string } };

export const useListingMetrics = (listingId: string) => {
  const { rest } = directusStore();
  const { user } = userStore();
  const queryClient = useQueryClient();

  // Query: Check if this listing is bookmarked
  const { data: checkSavedRes, isLoading } = useQuery({
    queryKey: checkSavesKey(listingId),
    queryFn: async () =>
      await rest.request(
        readItems('listings_directus_users', {
          filter: {
            listings_id: { _eq: listingId },
            directus_users_id: { _eq: user.id },
          },
          fields: ['id'],
        }),
      ),
  });

  // Mutation: Add bookmark
  const addBookmarkMutation = useMutation({
    mutationFn: async ({
      listing,
      recipient,
    }: {
      listing: Pick<Listing, 'id' | 'title'>;
      recipient: Pick<User, 'email' | 'id'>;
    }) => {
      const res = await rest.request(
        createItem('listings_directus_users', {
          listings_id: listing.id,
          directus_users_id: user.id,
        }),
      );

      if (user.id !== recipient.id) {
        await rest.request(
          createNotification({
            collection: 'listings',
            item: listing.id,
            message: `🚀 Your listing ${listing.title} just got bookmarked from ${user.email}`,
            recipient: recipient.id,
            sender: user.id,
            subject: 'New Bookmark Received!',
            type: 'user',
            related_user: user.id,
          }),
        );
      }
      return res;
    },
    onSuccess: (res) => {
      if (listingId === '20c48b4c-874e-4941-a8ce-f6843ccc7494') {
        console.log(res);
      }

      // update check saved state
      queryClient.setQueryData(checkSavesKey(listingId), [{ id: res.id }]);
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === 'listings',
      });
    },
  });

  // Mutation: Delete bookmark
  const deleteBookmarkMutation = useMutation({
    mutationFn: async () => {
      return await rest.request(
        deleteItems('listings_directus_users', {
          filter: {
            listings_id: {
              _eq: listingId,
            },
            directus_users_id: {
              _eq: user.id,
            },
          },
        }),
      );
    },
    onSuccess: (res) => {
      console.log('delete res', res);

      queryClient.setQueryData(checkSavesKey(listingId), []);
      queryClient.invalidateQueries({
        predicate: (q) => q.queryKey[0] === 'listings',
      });
    },
    onError: console.error,
  });

  return {
    bookmarkId:
      checkSavedRes && checkSavedRes.length ? checkSavedRes[0]!.id : undefined,
    addBookmark: addBookmarkMutation.mutateAsync,
    deleteBookmark: deleteBookmarkMutation.mutateAsync,
    isLoading:
      isLoading ||
      addBookmarkMutation.isPending ||
      deleteBookmarkMutation.isPending,
  };
};
