import { Room, User } from 'app/lib/types';

export type ContactListRowProp = Pick<
  User,
  'avatar' | 'id' | 'first_name' | 'last_name'
>;

export type GroupListRowProp = Pick<Room, 'avatar' | 'id' | 'type' | 'title'>;
