'use client';

import { z } from 'zod';

export const areaSchema = z.object({
  Area: z.string().min(2).max(50),
  Cost: z.coerce.number(),
});
