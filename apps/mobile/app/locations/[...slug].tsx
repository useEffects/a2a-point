import { readItem } from '@directus/sdk';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useQuery } from '@tanstack/react-query';
import { MediumListingCardProps } from 'app/components/cards/atoms/medium';
import {
  CommonFilters,
  commonFilters,
} from 'app/components/cards/molecules/listings';
import { ScrollView } from 'app/components/utils/virtual-lists';
import {
  getListingMetrics,
  getMembersCountForLocation,
  renderCardsQuery,
  useRenderCardQuery,
} from 'app/lib/misc/queries';
import { ListingCardMetrics, mediumListingsFields } from 'app/lib/props';
import {
  LocationDetailed as LocationDetailedComponent,
  LocationDetailedProps,
  LocationDetailedScreenHeader,
} from 'app/screens/location-detailed';
import { directusStore } from 'app/store/directus';
import { useGlobalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

function LocationSlug() {
  const params = useGlobalSearchParams<{ slug?: string[] }>();
  const { slug } = params;
  const [id, ...rest] = slug!;

  return rest.join('') === 'members' ? (
    <MembersScreen id={id!} />
  ) : (
    <LocationDetailedScreenComponent id={id!} />
  );
}

const LocationDetailedScreenComponent = ({ id }: { id: string }) => {
  const { rest } = directusStore();
  const navigation = useNavigation();
  const { data: room } = useQuery({
    queryKey: ['LocationDetailed', id],
    queryFn: async () =>
      (await rest.request(
        readItem('rooms' as never, id!, {
          fields: [
            '*',
            'members.*.directus_users_id.id',
            'members.*.directus_users_id.avatar',
          ],
          filter: {
            type: {
              _eq: 'group',
            },
          },
          // @ts-ignore
          deep: {
            members: {
              _limit: 10,
            },
          },
        }),
      )) as LocationDetailedProps['room'],
    enabled: !!id,
  });

  const { data: totalMembers } = useQuery({
    queryKey: ['LocationDetailed', id, 'totalMembers'],
    queryFn: async () => getMembersCountForLocation(id!),
    enabled: !!id,
  });

  const { data: listings } = useQuery<
    (MediumListingCardProps & ListingCardMetrics)[]
  >({
    queryKey: ['location detailed listings', id],
    queryFn: async () =>
      await renderCardsQuery<MediumListingCardProps>({
        collection: 'listings',
        fields: mediumListingsFields,
        filter: commonFilters[CommonFilters.GroupId](id!),
      }).then((res) =>
        Promise.all(
          res.map(async (res) => {
            const metrics = await getListingMetrics(res.id);
            return { ...res, ...metrics };
          }),
        ),
      ),
    initialData: [],
  });

  useEffect(() => {
    room &&
      navigation.setOptions({
        header: () => <LocationDetailedScreenHeader title={room.title} />,
      });
  }, [room, navigation]);

  return room && totalMembers !== undefined && totalMembers !== null ? (
    <ScrollView>
      <LocationDetailedComponent
        room={room}
        totalMembers={totalMembers}
        listings={listings}
      />
    </ScrollView>
  ) : (
    <></>
  );
};

export default function LocationSlugScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Location Slug"
        component={LocationSlug}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}

const MembersScreen = ({ id }: { id: string }) => {
  return <View></View>;
};
