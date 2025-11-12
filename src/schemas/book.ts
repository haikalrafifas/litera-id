import { z } from 'zod';
import pagination from './pagination';

export const body = z.object({
  title: z.string().min(1, { message: 'Title is required' }),
  // posted_by: z.coerce.number().min(1, { message: 'Invalid posted_by' }),
  content: z.string().optional(),
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
  slug: z.string().min(1, { message: 'Slug is required' }),
});

export const query = pagination;
