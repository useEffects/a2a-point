import { directusStore } from 'app/store/directus';
import { aggregate, Query } from '@directus/sdk';
import { defaultLimit, directusUrl, memberRole } from '../constants';
import { useQuery } from '@tanstack/react-query';
import { ListingCardMetrics } from '../props';
import { queryClient } from 'app/store/query';

export const getListingsCountForUser = async (userId: string) => {
  const { rest } = directusStore.getState();
  const getListingsCount = await rest.request(
    aggregate('listings', {
      aggregate: {
        count: ['*'],
      },
      query: {
        filter: {
          user_created: {
            _eq: userId,
          },
        },
      },
    }),
  );
  return getListingsCount?.[0]!.count as unknown as number;
};

export const getFeedbacksCountForUser = async (userId: string) => {
  const { rest } = directusStore.getState();
  const getFeedbacksCount = await rest.request(
    aggregate('feedbacks', {
      aggregate: {
        count: ['*'],
      },
      query: {
        filter: {
          agent: {
            _eq: userId,
          },
        },
      },
    }),
  );
  return getFeedbacksCount?.[0]!.count as unknown as number;
};

export const getListingsCount = async () => {
  const { rest } = directusStore.getState();
  const getListingsCount = await rest.request(
    aggregate('listings', {
      aggregate: {
        count: ['*'],
      },
    }),
  );
  return getListingsCount?.[0]!.count as unknown as number;
};

export const getListingsCountForLocation = async (locationId: string) => {
  const { rest } = directusStore.getState();
  const getListingsCount = await rest.request(
    aggregate('listings', {
      aggregate: {
        count: ['*'],
      },
      query: {
        filter: {
          location: {
            _eq: locationId,
          },
        },
      },
    }),
  );
  return getListingsCount?.[0]!.count as unknown as number;
};

export const getMembersCountForLocation = async (locationId: string) => {
  const { rest } = directusStore.getState();
  const membersCount = await rest.request(
    aggregate('rooms_directus_users', {
      aggregate: {
        count: ['*'],
      },
      query: {
        filter: {
          rooms_id: {
            _eq: locationId,
          },
        },
      },
    }),
  );
  return membersCount?.[0]!.count as unknown as number;
};

export const getCompaniesCount = async () => {
  const { rest } = directusStore.getState();
  const companiesCount = await rest.request(
    aggregate('companies', {
      aggregate: {
        count: ['*'],
      },
    }),
  );
  return companiesCount?.[0]!.count as unknown as number;
};

export const getCompaniesWithAgents = async () => {
  const { rest } = directusStore.getState();
  const companiesCount = await rest.request(
    aggregate('companies', {
      aggregate: {
        count: ['*'],
      },
      query: {
        filter: {
          _and: [
            {
              'count(members)': {
                _gt: 0,
              },
            },
            {
              members: {
                _nnull: true,
              },
            },
          ],
        },
      },
    }),
  );
  return companiesCount?.[0]!.count as unknown as number;
};

export const getLocationsCount = async () => {
  const { rest } = directusStore.getState();
  const locationsCount = await rest.request(
    aggregate('rooms', {
      aggregate: {
        count: ['*'],
      },
      query: {
        filter: {
          type: {
            _eq: 'group',
          },
        },
      },
    }),
  );
  return locationsCount?.[0]!.count as unknown as number;
};

export const getUsersCount = async () => {
  const { rest } = directusStore.getState();
  const usersCount = await rest.request(
    aggregate('directus_users', {
      aggregate: {
        // @ts-expect-error * not assignable
        count: ['*'],
      },
      query: {
        filter: {
          role: {
            _eq: memberRole,
          },
        },
      },
    }),
  );
  return usersCount?.[0]!.count as unknown as number;
};

export type RenderCardsType = {
  collection: string;
  fields?: string[];
  filter?: Record<string, any>;
  sort?: string[];
  offset?: number;
  limit?: number;
  searchText?: string;
  deep?: Record<string, any>;
};

export const viewsCountKey = (listingId: string) => ['views-count', listingId];
export const savesCountKey = (listingId: string) => ['saves-count', listingId];

export const getListingMetrics = async (
  listingId: string,
): Promise<ListingCardMetrics> => {
  const { rest } = directusStore.getState();
  const [viewsRes] = await queryClient.fetchQuery({
    queryKey: viewsCountKey(listingId),
    queryFn: async () =>
      await rest.request(
        aggregate('listings_directus_users_1', {
          aggregate: {
            count: ['directus_users_id'],
          },
          query: {
            filter: {
              listings_id: {
                _eq: listingId,
              },
            },
          },
        }),
      ),
  });
  const [savesRes] = await queryClient.fetchQuery({
    queryKey: savesCountKey(listingId),
    queryFn: async () =>
      await rest.request(
        aggregate('listings_directus_users', {
          aggregate: {
            count: ['directus_users_id'],
          },
          query: {
            filter: {
              listings_id: {
                _eq: listingId,
              },
            },
          },
        }),
      ),
  });
  return {
    views: viewsRes!.count['directus_users_id'],
    saves: savesRes!.count['directus_users_id'],
  };
};

export const renderCardsQuery = async <R>(props: RenderCardsType) => {
  const token = await directusStore.getState().rest.getToken();
  const {
    collection,
    fields = [],
    filter = {},
    sort = [],
    limit = 5,
    offset = 0,
    searchText = '',
    deep = {},
  } = props;

  const finalCollection = ['users'].includes(collection)
    ? collection
    : `items/${collection}`;

  const url = `${directusUrl}/${finalCollection}/?fields=${fields.join(',')}&limit=${limit}&filter=${JSON.stringify(filter)}&sort=${sort.join(',')}&offset=${offset}&search=${searchText}&deep=${JSON.stringify(deep)}`;
  const res = (await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.data) {
        console.log(res);
      }
      return res.data;
    })) as R[];
  return res;
};

export const renderCardsQuery2 = async <R>(
  props: Query<any, R> & { collection: string },
) => {
  const token = await directusStore.getState().rest.getToken();
  const {
    collection,
    fields = [],
    filter = {},
    sort = ['-date_created'],
    limit = defaultLimit,
    offset = 0,
    search = '',
    deep = {},
  } = props;

  const finalCollection = ['users'].includes(collection)
    ? collection
    : `items/${collection}`;

  const url = `${directusUrl}/${finalCollection}/?fields=${fields.join(',')}&limit=${limit}&filter=${JSON.stringify(filter)}&sort=${sort}&offset=${offset}&search=${search}&deep=${JSON.stringify(deep)}`;
  const res = (await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      if (!res.data) {
        console.log(res);
      }
      return res.data;
    })) as R[];
  return res;
};

export const useRenderCardQuery = <R>(props: RenderCardsType) => {
  return useQuery<R[]>({
    queryKey: ['fetching cards list', props],
    queryFn: async () => renderCardsQuery<R>({ ...props }),
    initialData: [],
  });
};
