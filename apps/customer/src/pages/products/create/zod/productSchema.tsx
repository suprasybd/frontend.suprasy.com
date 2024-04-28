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
  Inventory: z.coerce.number().min(0),
  Options: z.array(OptionSchema),
});

const ImageUrl = z.object({
  ImageUrl: z.string().url(),
});

const AttributeValues = z.object({
  Value: z.string(),
  Inventory: z.coerce.number().min(0),
  Price: z.coerce.number().min(0),
  Sku: z.string().max(100),
  ShowCompareAtPrice: z.boolean(),
  CompareAtPrice: z.coerce.number().min(0),
});

export const productSchema = z
  .object({
    Type: z.string(),
    CategoryId: z.number().optional(),
    Slug: z.string().min(3),
    Title: z.string().min(3),
    Description: z.string().min(10),
    Summary: z.string().min(10),
    Price: z.coerce.number().optional(),
    Sku: z.string().max(100).optional(),
    ShowCompareAtPrice: z.boolean().optional(),
    CompareAtPrice: z.coerce.number().min(0).optional(),
    Status: z.string().min(1),
    Inventory: z.coerce.number().optional(),
    HasVariants: z.boolean().default(false).optional(),
    AttributeName: z.string().min(1).optional(),
    AttributeValue: z.array(AttributeValues).optional(),
    Images: z.array(ImageUrl).min(1),
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
      if (!schema.HasVariants && !schema.Sku) {
        return false;
      } else {
        return true;
      }
    },
    { message: 'No sku found while there is no variants.', path: ['Price'] }
  )
  .refine(
    (schema) => {
      if (!schema.HasVariants && !schema.ShowCompareAtPrice) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: 'No ShowCompareAtPrice found while there is no variants.',
      path: ['Price'],
    }
  )
  .refine(
    (schema) => {
      if (!schema.HasVariants && !schema.CompareAtPrice) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: 'No CompareAtPrice found while there is no variants.',
      path: ['Price'],
    }
  )
  .refine(
    (schema) => {
      if (
        (schema.HasVariants && !schema.AttributeValue?.length) ||
        (schema.HasVariants && !schema.AttributeName)
      ) {
        return false;
      } else {
        return true;
      }
    },
    {
      message: 'Please add attribute name , values.',
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
