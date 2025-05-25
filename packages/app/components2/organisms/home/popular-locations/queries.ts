import { UseQueryOptions } from '@tanstack/react-query';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import { SmallLocationCardProps, smallLocationFields } from 'app/lib/props';
import { QueryOptsInstance } from 'app/shared/utils/query-class';

export class CreatePopularLocationCardsQpts
  implements QueryOptsInstance<SmallLocationCardProps>
{
  get() {
    return {
      queryKey: ['rooms', 'small locations query'],
      queryFn: () =>
        renderCardsQuery2<SmallLocationCardProps>({
          collection: 'rooms',
          fields: smallLocationFields,
          filter: {
            type: {
              _eq: 'group',
            },
          },
          limit: 15,
        }),
    } as UseQueryOptions<SmallLocationCardProps[]>;
  }
}
