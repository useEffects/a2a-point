import { AdvertisementCardProps } from 'app/components/cards/atoms/advertisements';
import { MediumListingCardProps } from 'app/components/cards/atoms/medium';
import {
  ConfirmedAdvertisementCardProps,
  IS_AD_TYPE,
  mediumCardListingsWithAdsQueryFn,
} from 'app/components/cards/molecules2/listings';
import { defaultLimit } from 'app/lib/constants';
import { randomMergeNoConsecutiveB } from 'app/lib/helpers';
import { getListingMetrics, renderCardsQuery2 } from 'app/lib/misc/queries';
import { ListingCardMetrics } from 'app/lib/props';
import * as _ from 'lodash';
import { Query } from '@directus/sdk';
import { QueryFnType } from 'app/components/infinite';

export const listingsScreenQuery = {
  queryKey: ['listings screen'],
  queryFn: () => mediumCardListingsWithAdsQueryFn(),
};

export const MediumListingCardWithAdsQuery = (
  queryFnArgs: Query<
    any,
    | (MediumListingCardProps & ListingCardMetrics)
    | ConfirmedAdvertisementCardProps
  > = {},
) =>
  ({
    queryKey: ['listings screen query with ads', queryFnArgs],
    queryFn: async (apiOptions) => {
      const { limit = defaultLimit, offset = 0 } = apiOptions;
      const currentPage = Math.floor(offset / limit);

      const adsLimit = limit / 5;
      const adsOffset = currentPage * adsLimit;

      const listings = await renderCardsQuery2<MediumListingCardProps>({
        collection: 'listings',
        ...apiOptions,
      }).then((res) =>
        Promise.all(
          res.map(async (r) => {
            const metrics = await getListingMetrics(r.id);
            return { ...r, ...metrics };
          }),
        ),
      );
      const ads = await renderCardsQuery2<AdvertisementCardProps>({
        collection: 'advertisements',
        fields: [
          'id',
          'caption',
          'title',
          'photo',
          'featured',
          'link_to_open',
          'date_created',
          'user_created.id',
          'user_created.avatar',
          'user_created.first_name',
          'user_created.last_name',
          'user_created.email',
        ],
        filter: {
          isActive: {
            _eq: true,
          },
        },
        sort: ['-date_created'],
        limit: adsLimit,
        offset: adsOffset,
      }).then((res) => res.map((r) => ({ ...r, [IS_AD_TYPE]: true })));

      return randomMergeNoConsecutiveB(listings, ads);
    },
  }) as {
    queryKey: unknown[];
    queryFn: QueryFnType<MediumListingCardProps | AdvertisementCardProps>;
  };
