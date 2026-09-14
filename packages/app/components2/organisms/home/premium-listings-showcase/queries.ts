import { UseQueryOptions } from '@tanstack/react-query';
import { SmallListingCardProps } from 'app/components/cards/atoms/small';
import {
  CommonFilters,
  commonFilters,
} from 'app/components/cards/molecules/listings';
import { defaultLimit } from 'app/lib/constants';
import { getListingMetrics, renderCardsQuery2 } from 'app/lib/misc/queries';
import { ListingCardMetrics, smallListingsFields } from 'app/lib/props';
import { QueryOptsInstance } from 'app/shared/utils/query-class';

export class CreatePremiumListingCardsQOpts
  implements QueryOptsInstance<SmallListingCardProps & ListingCardMetrics>
{
  get() {
    return {
      queryKey: ['listings', 'home screen premium listings small cards query'],
      queryFn: async () =>
        renderCardsQuery2<SmallListingCardProps>({
          collection: 'listings',
          fields: smallListingsFields,
          filter: commonFilters[CommonFilters.Premium](),
          limit: defaultLimit,
        }).then((res) =>
          Promise.all(
            res.map(async (r) => {
              const metrics = await getListingMetrics(r.id);
              return { ...r, ...metrics };
            }),
          ),
        ),
    } as UseQueryOptions<(SmallListingCardProps & ListingCardMetrics)[]>;
  }
}
