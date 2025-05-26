import { Room } from 'app/lib/types';
import { z } from 'zod';

export const ExtraSmallLocationCardFields = ['id', 'title', 'avatar'];

export type ExtraSmallLocationCardProps = Pick<Room, 'id' | 'title' | 'avatar'>;

export const extraSmallLocationCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  avatar: z.string().nullable(),
});
