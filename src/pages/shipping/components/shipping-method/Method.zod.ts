'use client';

import { z } from 'zod';

export const methodSchema = z.object({
  DeliveryMethod: z.string().min(2).max(200),
  Cost: z.number().min(0),
  Description: z.string().min(2).max(500),
});
