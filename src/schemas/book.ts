import { z } from 'zod';
import pagination from './pagination';

export const body = z.object({
  isbn: z.string().length(13, { message: 'ISBN must be 13 characters' }),
  title: z.string().min(1, { message: 'Title is required' }),
  image: z
    .instanceof(File, { message: 'Image must be a file upload' })
    .refine((file) => file.size < 2 * 1024 * 1024, {
      message: 'Image must be less than 2MB',
    })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'Only JPG or PNG images are allowed',
    }).optional(),
  snippet: z.string().max(255, { message: 'Snippet must be at most 255 characters' }).optional(),
  author: z.string().max(255, { message: 'Author must be at most 255 characters' }).optional(),
  publisher: z.string().max(255, { message: 'Publisher must be at most 255 characters' }).optional(),
  published_at: z.coerce.date().optional(),
  category: z.string().max(100, { message: 'Category must be at most 100 characters' }).optional(),
  description: z.string().optional(),
  stock: z.number().int().nonnegative().optional(),
});

export const param = z.object({
  isbn: z.string().length(13, { message: 'ISBN must be 13 characters' }),
});

export const query = pagination;

export type Book = z.infer<typeof body>;
