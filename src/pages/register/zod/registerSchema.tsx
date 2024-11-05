import { z } from 'zod';

export const registerSchema = z.object({
  FullName: z.string().min(1),

  Email: z.string().email(),
  Password: z
    .string()
    .min(8)
    .refine((val) => /.*[0-9].*/.test(val ?? ''), 'At least put one number!'),
});
