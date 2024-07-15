import { z } from 'zod';

export const resetPasswordSchema = z.object({
  Password: z
    .string()
    .min(8)
    .refine((val) => /.*[0-9].*/.test(val ?? ''), 'At least put one number!'),
});
