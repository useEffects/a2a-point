import { UseQueryOptions } from '@tanstack/react-query';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import { NewsProps } from 'app/lib/types';
import { QueryOptsInstance } from 'app/shared/utils/query-class';

export class CreateNewsAndFeedsQOpts implements QueryOptsInstance<NewsProps> {
  get() {
    return {
      queryKey: ['news', 'fetch news and feed'],
      queryFn: async () =>
        await renderCardsQuery2<NewsProps>({
          collection: 'news',
        }),
    } as UseQueryOptions<NewsProps[]>;
  }
}
