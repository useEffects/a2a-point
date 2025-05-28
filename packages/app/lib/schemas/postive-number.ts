import { z } from 'zod';

export const positiveNumberSchema = z
  .number()
  .positive()
  .refine((val) => !Number.isNaN(val), {
    message: 'Value cannot be NaN',
  });
