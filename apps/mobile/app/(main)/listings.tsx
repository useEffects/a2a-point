import { MediumListingCardProps } from 'app/components/cards/atoms/medium';
import { getListingMetrics, renderCardsQuery } from 'app/lib/misc/queries';
import { mediumListingsFields } from 'app/lib/props';
import { ListingsScreen as ListingsScreenBase } from 'app/screens/listings';
import { useQuery } from '@tanstack/react-query';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ListingsScreen() {
  const { top, bottom } = useSafeAreaInsets();
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
    <ScrollView
      contentContainerStyle={{ paddingTop: top }}
    >
      <ListingsScreenBase data={data} />;
    </ScrollView>
  );
}
