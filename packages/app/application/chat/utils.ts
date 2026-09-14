import { URL } from 'react-native-url-polyfill';
import { DIRECTUS_URL } from 'app/lib/constants';
import { z } from 'zod';

export const getChatQueryKeyForRoomId = (roomId: string) => [
  'CHAT MESSAGES',
  roomId,
];

export const roomsSubscribedQueryKey = ['ROOM SUBSCRIBED FOR USER'];

export const directusOrigin = new URL(DIRECTUS_URL).host;

export const chatFields = [
  '*',
  'user_created.avatar',
  'user_created.id',
  'user_created.first_name',
  'user_created.last_name',
  'user_created.plan',
  'assets.directus_files_id.id',
  'assets.directus_files_id.type',
  'assets.directus_files_id.filename_download',
];

export const roomSubscribedFields = [
  '*',
  'members.directus_users_id.avatar',
  'members.directus_users_id.first_name',
  'members.directus_users_id.last_name',
  'members.directus_users_id.id',
];

export const SocketMessageSchema = z.object({
  event: z.string(),
  type: z.string(),
  data: z.array(
    z.object({
      id: z.string(),
      room: z.string(),
      content: z.string(),
      date_created: z.string(),
      user_created: z.object({
        id: z.string(),
        first_name: z.string(),
        last_name: z.string(),
        avatar: z.string().nullable(),
        plan: z.string(),
      }),
      assets: z.array(
        z.object({
          directus_files_id: z.object({
            id: z.string(),
            type: z.string(),
            filename_download: z.string(),
          }),
        }),
      ),
    }),
  ),
});

export const fetchLimit = 30;
