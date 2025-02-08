import {
  getListingsCountForLocation,
  getMembersCountForLocation,
  renderCardsQuery,
} from 'app/lib/misc/queries';
import { MediumLocationCardProps, mediumLocationFields } from 'app/lib/props';
import {
  LocationsList,
  LocationsListScreenHeader,
} from 'app/screens/locations-list';
import { useQuery } from '@tanstack/react-query';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect } from 'react';
import { useNavigation } from 'expo-router';

const Stack = createNativeStackNavigator();

function LocationsScreenComponent() {
  const navigation = useNavigation();
  const { data } = useQuery({
    queryKey: ['locations'],
    queryFn: async () =>
      await renderCardsQuery<MediumLocationCardProps>({
        collection: 'rooms',
        fields: mediumLocationFields,
        filter: {
          type: {
            _eq: 'group',
          },
        },
      }).then(
        async (res) =>
          await Promise.all(
            res.map(async (r) => {
              const membersCount = await getMembersCountForLocation(r.id);
              const listingsCount = await getListingsCountForLocation(r.id);
              return { ...r, membersCount, listingsCount };
            }),
          ),
      ),
    initialData: [],
  });

  useEffect(() => {
    navigation.setOptions({
      header: () => <LocationsListScreenHeader />,
    });
  }, [navigation]);

  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <LocationsList data={data} />
    </ScrollView>
  );
}

export default function LocationsScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="locations"
        component={LocationsScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
