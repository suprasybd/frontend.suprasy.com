import { z } from 'zod';

export const resetSchema = z.object({
  Email: z.string().email(),
});
