import { z } from 'zod';

const Options = z.object({
  Name: z.string().min(1),
  Values: z.array(z.string().min(1)),
});

export const OptionSchema = z.object({
  OptionName: z.string(),
  Value: z.string(),
});

const VariantSchema = z.object({
  Price: z.coerce.number(),
  IsActive: z.boolean(),
  Sku: z.string().min(1),
  Inventory: z.coerce.number().min(0),
  Options: z.array(OptionSchema),
});

const ImageUrl = z.string().url();

const ImageObject = z.object({
  ImageUrl: ImageUrl,
});

export const productSchema = z
  .object({
    Type: z.string(),
    CategoryId: z.number().optional(),
    Slug: z.string().min(3),
    Title: z.string().min(3),
    Description: z.string().min(10),
    Price: z.coerce.number().optional(),
    Inventory: z.coerce.number().optional(),
    HasVariants: z.boolean().default(false).optional(),
    VariantsOptions: z.array(Options),
    Variants: z.array(VariantSchema),
    Images: z.array(ImageObject).min(1),
    UploadingList: z.array(z.object({})).optional(),
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
  )
  .refine(
    (schema) => {
      if (!schema.HasVariants && !schema.Inventory) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: 'Enter single product inventory',
      path: ['Inventory'],
    }
  );
