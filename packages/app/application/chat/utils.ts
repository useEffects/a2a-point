import { URL } from 'react-native-url-polyfill';
import { DIRECTUS_URL } from 'app/lib/constants';

export const getChatQueryKeyForRoomId = (roomId: string) => [
  'CHAT MESSAGES',
  roomId,
];

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
