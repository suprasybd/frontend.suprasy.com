import { z } from 'zod';

export const paymentSchema = z.object({
  PaymentMethod: z.string().min(2).max(200),
  Description: z.string().min(2).max(500),
});
