import { z } from 'zod';

export const body = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  username: z.string().max(32, { message: 'Username must be at most 32 characters' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Confirm Password must be at least 6 characters' }),
  image: z
    .instanceof(File, { message: 'Image must be a file upload' })
    .refine((file) => file.size < 2 * 1024 * 1024, {
      message: 'Image must be less than 2MB',
    })
    .refine((file) => ['image/jpeg', 'image/png'].includes(file.type), {
      message: 'Only JPG or PNG images are allowed',
    }).optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords must match',
  path: ['confirmPassword'],
});

export type User = z.infer<typeof body>;
