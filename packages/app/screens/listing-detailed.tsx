import { createItem, readItems } from '@directus/sdk';
import { Header } from 'app/components/header';
import { FullListingCard } from 'app/components/cards/atoms/full';
import { BackButton, HeaderTitle } from 'app/components/header';
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
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export function ListingScreen({
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
    <View className='py-4'>
      <FullListingCard {...listing} />
      {!authenticated ? <LoginPopover /> : <></>}
    </View>
  ) : (
    <></>
  );
}

export function ListingDetailedScreenHeader({ title }: { title: string }) {
  const { top } = useSafeAreaInsets();
  return (
    <Header height={'auto'}>
      <View
        className="flex-row items-center pb-4"
        style={{ paddingTop: top + 16 }}
      >
        <View className="h-12 flex-row items-center gap-4">
          <BackButton />
          <HeaderTitle>{title}</HeaderTitle>
        </View>
      </View>
    </Header>
  );
}
