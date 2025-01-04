import {
  getListingsCountForLocation,
  getMembersCountForLocation,
  renderCardsQuery,
} from 'app/lib/misc/queries';
import { MediumLocationCardProps, mediumLocationFields } from 'app/lib/props';
import { LocationsList } from 'app/screens/locations-list';
import { useQuery } from '@tanstack/react-query';
import { ScrollView } from 'app/components/utils/virtual-lists';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LocationsScreen() {
  const { top, bottom } = useSafeAreaInsets();
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
  return (
    <ScrollView
      contentContainerStyle={{ paddingTop: top }}
    >
      <LocationsList data={data} />
    </ScrollView>
  );
}
