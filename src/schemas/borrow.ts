import { z } from 'zod';
import pagination from './pagination';

export const body = z.object({
  item_id: z.uuidv4().min(36, { message: 'UUID is required' }),
  qty: z.coerce.number().min(1, { message: 'Quantity must be a number' }),
});

export const param = z.object({
  uuid: z.uuidv4().min(36, { message: 'UUID is required' }),
});

export const query = pagination;
