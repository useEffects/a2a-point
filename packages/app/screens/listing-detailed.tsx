import { createItem, readItems } from '@directus/sdk';
import { FullListingCard } from 'app/components/cards/atoms/full';
import {
  FullListingDetailedProps,
  ListingCardMetrics,
  UsersCardMetrics,
} from 'app/lib/props';
import { LoginPopover } from 'app/screens/listings';
import { directusStore } from 'app/store/directus';
import { queryClient } from 'app/store/query';
import userStore from 'app/store/user';
import { useEffect } from 'react';

export default function FullListingScreen({
  listing,
}: {
  listing: FullListingDetailedProps & UsersCardMetrics & ListingCardMetrics;
}) {
  const { rest, authenticated } = directusStore();
  const { user } = userStore();
  const listingId = listing.id;

  useEffect(() => {
    if (!listingId || !listing || !authenticated) return;
    async function addViewCount() {
      try {
        const viewedBy = await queryClient.fetchQuery({
          queryKey: [
            'listings_directus_users_1',
            listingId,
            user.id,
            'viewed_by',
          ],
          queryFn: async () =>
            await rest.request(
              readItems('listings_directus_users_1', {
                filter: {
                  listings_id: {
                    _eq: listingId,
                  },
                  directus_users_id: {
                    _eq: user.id,
                  },
                },
              }),
            ),
        });
        if (!viewedBy?.length) {
          await rest.request(
            createItem('listings_directus_users_1', {
              listings_id: listingId,
              directus_users_id: user.id,
            }),
          );
        }
      } catch (error) {
        console.log('Error in full listing card', error);
      }
    }
    addViewCount();
  }, [listingId, rest, user.id, listing, authenticated]);

  return listing ? (
    <>
      <FullListingCard {...listing} />
      {!authenticated ? <LoginPopover /> : <></>}
    </>
  ) : (
    <></>
  );
}
