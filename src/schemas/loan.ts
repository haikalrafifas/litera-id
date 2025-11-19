import { z } from 'zod';
import pagination from './pagination';

export const body = z.object({
  user_id: z.string().uuid({ message: 'User ID must be a valid UUID' }),
  item_id: z.string().uuid({ message: 'Item ID must be a valid UUID' }),
  qty: z.coerce.number().min(1, { message: 'Quantity must be a number' }),
  notes: z.string().optional(),
});

export const param = z.object({
  uuid: z.string().uuid({ message: 'UUID is required' }),
});

export const query = pagination;

export type Loan = z.infer<typeof body>;
