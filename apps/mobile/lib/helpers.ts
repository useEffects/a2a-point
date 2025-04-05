import { queryClient } from 'app/store/query';
import { listingsScreenQuery } from '../queries/listings';

export const prefetchQueries = async () => {
  const results = await Promise.allSettled([
    queryClient.prefetchQuery(listingsScreenQuery),
  ]);

  return results.every((r) => r.status === 'fulfilled');
};
