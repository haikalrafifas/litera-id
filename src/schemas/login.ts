import { z } from 'zod';

export const body = z.object({
  username: z.string().max(32, { message: 'Username must be at most 32 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});
