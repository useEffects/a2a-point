import { Room, User } from 'app/lib/types';

export type RoomSubscribed = Pick<Room, 'avatar' | 'id' | 'type' | 'title'> & {
  members: Member[];
};

export type Member = {
  directus_users_id: Pick<User, 'id' | 'avatar' | 'first_name' | 'last_name'>;
};
