import { QueryOptsInstance } from 'app/shared/utils/query-class';
import { PurposeProps } from './purpose';
import { UseQueryOptions } from '@tanstack/react-query';
import { purposes } from './utils';
import { directusStore } from 'app/store/directus';
import { aggregate } from '@directus/sdk';
import {
  CommonFilters,
  commonFilters,
} from 'app/components/cards/molecules/listings';

export class CreatePurposeQOpts implements QueryOptsInstance<PurposeProps> {
  get() {
    return {
      queryKey: ['listings', 'fetching metrics'],
      queryFn: async () => {
        const { rest } = directusStore.getState();
        const res = await Promise.all(
          purposes.map(async (p) => {
            const count = await rest.request(
              aggregate('listings', {
                aggregate: { count: '*' },
                query: {
                  filter: commonFilters[p.filterType as CommonFilters](),
                },
              }),
            );
            return { ...p, metric: Number(count[0]?.count) } as PurposeProps;
          }),
        );

        return res;
      },
    } as UseQueryOptions<PurposeProps[]>;
  }
}
