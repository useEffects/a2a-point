import { Query } from '@directus/sdk';
import { UseQueryOptions } from '@tanstack/react-query';

export const createLocationsSearchQpts = ({
  query = {},
}: {
  query?: Query<any, any>;
}) => {
  return {
    queryKey: ['listings auto complete filters', 'locations', query],
    queryFn: async () => {},
  } as UseQueryOptions;
};
