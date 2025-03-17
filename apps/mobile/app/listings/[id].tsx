import {
  ListingDetailedScreenHeader,
  ListingScreen as ListingScreenBase,
} from 'app/screens/listing-detailed';
import { useQuery } from '@tanstack/react-query';
import { directusStore } from 'app/store/directus';
import { readItem } from '@directus/sdk';
import { fullListingCardFields, FullListingDetailedProps } from 'app/lib/props';
import {
  getFeedbacksCountForUser,
  getListingMetrics,
  getListingsCountForUser,
} from 'app/lib/misc/queries';
import { useGlobalSearchParams, useNavigation } from 'expo-router';
import { Stacked } from '../../components/stacked';

export default function ListingDetailedScreenComponent() {
  const { id } = useGlobalSearchParams();
  const { rest } = directusStore();
  const navigation = useNavigation();

  const { data } = useQuery({
    queryKey: ['ListingDetailed', id],
    queryFn: () => {
      return rest.request(
        readItem('listings' as never, id! as string, {
          fields: fullListingCardFields,
        }),
      ) as Promise<FullListingDetailedProps>;
    },
    enabled: !!id,
  });

  const { data: metrics } = useQuery({
    queryKey: ['ListingMetrics', id],
    queryFn: async () => await getListingMetrics(id! as string),
    enabled: !!id,
  });

  const { data: usersMetrics } = useQuery({
    queryKey: ['UserMetrics', id],
    queryFn: async () =>
      Promise.all([
        getListingsCountForUser(data!.user_created.id),
        getFeedbacksCountForUser(data!.user_created.id),
      ]),
    enabled: !!data,
  });

  return data && metrics && usersMetrics ? (
    <Stacked header={() => <ListingDetailedScreenHeader title={data.title} />}>
      <ListingScreenBase
        listing={{
          ...data,
          ...metrics,
          listingsCount: usersMetrics![0],
          ratingsCount: usersMetrics![1],
        }}
      />
    </Stacked>
  ) : (
    <></>
  );
}
