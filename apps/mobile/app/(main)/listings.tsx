import { MediumListingCardProps } from 'app/components/cards/atoms/medium';
import { getListingMetrics, renderCardsQuery } from 'app/lib/misc/queries';
import { mediumListingsFields } from 'app/lib/props';
import {
  ListingsScreen as ListingsScreenBase,
  ListingsScreenHeader,
} from 'app/screens/listings';
import { useQuery } from '@tanstack/react-query';
import { ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function ListingsScreenComponent() {
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({
      header: () => <ListingsScreenHeader />,
      headerShown: true,
    });
  }, [navigation]);

  const { data } = useQuery({
    queryKey: ['Listings page medium cards'],
    queryFn: async () =>
      await renderCardsQuery<MediumListingCardProps>({
        collection: 'listings',
        fields: mediumListingsFields,
        limit: 30,
      }).then((res) =>
        Promise.all(
          res.map(async (listing) => {
            const metrics = await getListingMetrics(listing.id);
            return { ...listing, ...metrics };
          }),
        ),
      ),
    initialData: [],
  });

  return (
    <ScrollView>
      <ListingsScreenBase data={data} />;
    </ScrollView>
  );
}

export default function ListingsScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Listings"
        component={ListingsScreenComponent}
        options={{ header: () => null }}
      />
    </Stack.Navigator>
  );
}
