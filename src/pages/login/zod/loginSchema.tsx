import { z } from 'zod';

export const loginSchema = z.object({
  Email: z.string().email(),
  Password: z.string().min(3),
});
