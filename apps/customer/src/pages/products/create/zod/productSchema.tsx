import { z } from 'zod';

const Options = z.object({
  Name: z.string().min(1),
  Options: z.array(z.string().min(1)),
});

export const productSchema = z.object({
  Type: z.string(),
  CategoryId: z.number().optional(),
  Slug: z.string().min(3),
  Title: z.string().min(3),
  Description: z.string().min(10),
  Price: z.number().positive(),
  HasVariants: z.boolean().default(false).optional(),
  VariantsOptions: z.array(Options),
});
