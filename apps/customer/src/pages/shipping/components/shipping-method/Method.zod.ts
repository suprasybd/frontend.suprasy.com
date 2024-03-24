'use client';

import { z } from 'zod';

export const methodSchema = z.object({
  DeliveryMethod: z.string().min(2).max(50),
  Cost: z.coerce.number(),
});
