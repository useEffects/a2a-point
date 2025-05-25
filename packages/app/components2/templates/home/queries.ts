import { UseQueryOptions } from '@tanstack/react-query';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import { SmallLocationCardProps, smallLocationFields } from 'app/lib/props';
import _ from 'lodash';

export const smallLocationsCardQuery = <T extends SmallLocationCardProps>() => {
  return {
    queryKey: ['rooms', 'small locations query'],
    queryFn: () =>
      renderCardsQuery2<SmallLocationCardProps>(
        _.merge({
          collection: 'rooms',
          fields: smallLocationFields,
          filter: {
            type: {
              _eq: 'group',
            },
          },
          limit: 15,
        }),
      ),
  } as UseQueryOptions<T[]>;
};
