import { UseQueryOptions } from '@tanstack/react-query';
import {
  ContactListRowProp,
  GroupListRowProp,
} from 'app/components2/molecules/chat/types';
import { renderCardsQuery2 } from 'app/lib/misc/queries';
import userStore from 'app/store/user';

export const createContactListQOpts = (search: string) => {
  return {
    queryKey: ['Contact List', search],
    queryFn: async () => {
      const { user } = userStore.getState();

      return renderCardsQuery2<ContactListRowProp>({
        collection: 'users',
        filter: {
          id: {
            _neq: user.id,
          },
        },
        fields: ['id', 'first_name', 'last_name', 'avatar'],
        search,
      });
    },
    initialData: [],
    enabled: Boolean(search),
  } as UseQueryOptions<ContactListRowProp[]>;
};

export const createGroupListQOpts = (search: string) => {
  return {
    queryKey: ['Group List', search],
    queryFn: async () => {
      return renderCardsQuery2<GroupListRowProp>({
        collection: 'rooms',
        fields: ['id', 'avatar', 'title'],
        filter: {
          type: {
            _eq: 'group',
          },
        },
        search,
      });
    },
    initialData: [],
    enabled: Boolean(search),
  } as UseQueryOptions<GroupListRowProp[]>;
};
