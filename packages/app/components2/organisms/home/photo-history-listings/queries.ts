import { PhotoListingProps } from 'app/components/cards/atoms/photo';
import {
  CommonFilters,
  commonFilters,
} from 'app/components/cards/molecules/listings';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import { photoListingsFields } from 'app/lib/props';
import { Prefetchable, QueryOptsInstance } from 'app/shared/utils/query-class';

@Prefetchable()
export class CreatePhotoListingsQOPts
  implements QueryOptsInstance<PhotoListingProps>
{
  get() {
    return {
      queryKey: ['listings'],
      queryFn: async () =>
        renderCardsQuery2<PhotoListingProps>({
          collection: 'listings',
          fields: photoListingsFields,
          filter: commonFilters[CommonFilters.ViewedByMe](),
        }),
      initialData: [],
    };
  }
}
