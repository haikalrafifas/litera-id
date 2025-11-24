import { z } from 'zod';
import pagination from './pagination';

export const statuses = [
  'requested', 'approved', 'cancelled',
  'denied', 'loaned', 'returned', 'overdue',
] as const;

export const body = z.object({
  isbn: z.string().length(13, { message: 'ISBN must be 13 characters' }),
  qty: z.coerce.number().min(1, { message: 'Quantity must be at least 1' }),
  notes: z.string().optional(),
});

export const updateBody = z.object({
  status: z.enum(statuses).optional(),
  notes: z.string().optional(),
});

export const param = z.object({
  uuid: z.string().uuid({ message: 'UUID is required' }),
});

export const query = pagination.extend({
  // status: z.enum(statuses).optional(),
  status: z
    .string()
    .optional()
    .transform((val) => {
      if (!val) return undefined;

      return val
        .split(',')
        .map((v) => v.trim())
        .filter(Boolean);
    })
    .pipe(z.array(z.enum(statuses)).optional()),
});

export type Loan = z.infer<typeof body>;
