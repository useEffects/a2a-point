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
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { ListingsScreenHeader } from 'app/screens/listings';

const Stack = createNativeStackNavigator();

function ListingDetailedScreenComponent() {
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

  useEffect(() => {
    data &&
      navigation.setOptions({
        header: () => <ListingDetailedScreenHeader title={data.title} />,
      });
  }, [navigation, data]);

  return data && metrics && usersMetrics ? (
    <ScrollView>
      <ListingScreenBase
        listing={{
          ...data,
          ...metrics,
          listingsCount: usersMetrics![0],
          ratingsCount: usersMetrics![1],
        }}
      />
    </ScrollView>
  ) : (
    <></>
  );
}

export default function ListingDetailedScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Listing Detailed"
        component={ListingDetailedScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
