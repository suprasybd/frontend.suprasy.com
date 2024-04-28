'use client';

import { z } from 'zod';

export const methodSchema = z.object({
  DeliveryMethod: z.string().min(2).max(200),
  Cost: z.coerce.number(),
});
