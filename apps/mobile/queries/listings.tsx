import { MediumListingCardProps } from 'app/components/cards/atoms/medium';
import { renderCardsQuery, getListingMetrics } from 'app/lib/misc/queries';
import { mediumListingsFields } from 'app/lib/props';

export const listingsScreenQuery = {
  queryKey: ['listings screen'],
  queryFn: () =>
    renderCardsQuery<MediumListingCardProps>({
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
};
