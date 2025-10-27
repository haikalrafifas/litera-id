import { z } from 'zod';

export default z.object({
  page: z.coerce.number().min(1).default(1), // e.g. 1, 2
  limit: z.coerce.number().min(1).max(100).default(10), // e.g. 10
  order_by: z.string().optional(), // e.g. created_at
  sort: z.enum(['asc', 'desc']).default('desc'), // asc, desc
});
