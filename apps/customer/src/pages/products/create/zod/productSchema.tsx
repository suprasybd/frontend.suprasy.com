import { z } from 'zod';

const Options = z.object({
  Name: z.string().min(1),
  Options: z.array(z.string().min(1)),
});

export const productSchema = z
  .object({
    Type: z.string(),
    CategoryId: z.number().optional(),
    Slug: z.string().min(3),
    Title: z.string().min(3),
    Description: z.string().min(10),
    Price: z.string().optional(),
    HasVariants: z.boolean().default(false).optional(),
    VariantsOptions: z.array(Options),
  })
  .refine(
    (schema) => {
      if (!schema.HasVariants && !schema.Price) {
        return false;
      } else {
        return true;
      }
    },
    { message: 'No price found while there is no variants.', path: ['Price'] }
  )
  .refine(
    (schema) => {
      if (schema.HasVariants && !schema.VariantsOptions.length) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: 'Please add variants.',
      path: ['HasVariants'],
    }
  );
