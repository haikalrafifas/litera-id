import { z } from 'zod';
import pagination from './pagination';

export const body = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  qty: z.coerce.number().min(1, { message: 'Quantity must be a number' }).default(1),
  image: z
    .instanceof(File, { message: 'Image must be a file upload' })
    .refine((file) => file.size < 2 * 1024 * 1024, {
      message: 'Image must be less than 2MB',
    })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'Only JPG or PNG images are allowed',
    }).optional(),
});

export const param = z.object({
  uuid: z.uuidv4().min(36, { message: 'UUID is required' }),
});

export const query = pagination;
