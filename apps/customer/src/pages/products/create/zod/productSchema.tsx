import { z } from 'zod';

export const productSchema = z.object({
  Type: z.string(),
  CategoryId: z.number().optional(),
  Slug: z.string().min(3),
  Title: z.string().min(3),
  Description: z.string().min(10),
  Price: z.number().positive(),
});
