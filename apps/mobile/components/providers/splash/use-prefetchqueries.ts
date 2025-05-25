import { useEffect, useState } from 'react';
import { prefetchableQueryOpts } from '../../../../../packages/app/shared/utils/query-class';
import { queryClient } from 'app/store/query';

export function usePrefetchQueries() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const promises = prefetchableQueryOpts.map((q) => {
      const instance = new q();
      const options = instance.get();
      if ('getNextPageParam' in options) {
        return queryClient.prefetchInfiniteQuery(options);
      } else {
        return queryClient.prefetchQuery(options);
      }
    });

    Promise.all(promises).then(() => setReady(true));
  }, []);

  return ready;
}
