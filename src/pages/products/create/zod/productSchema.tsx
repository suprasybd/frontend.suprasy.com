import { z } from 'zod';

export const OptionSchema = z.object({
  OptionName: z.string(),
  Value: z.string(),
});

const ImageUrl = z.object({
  ImageUrl: z.string().url(),
});

const VariationSchema = z.object({
  Id: z.number().optional(),
  ChoiceName: z.string(),
  Price: z.coerce.number().min(0),
  SalesPrice: z.coerce.number(),
  Sku: z.string().min(1),
  Inventory: z.coerce.number().min(0),
  Images: z.array(ImageUrl).min(1),
  Deleted: z.boolean().default(false),
});

export const productSchema = z.object({
  Type: z.string(),
  CategoryId: z.number().optional(),
  Slug: z.string().min(3),
  Title: z.string().min(3),
  Description: z.string().min(10).max(7000),
  Summary: z.string().min(10).max(1000),
  Status: z.string().min(1),
  ProductVariations: z.array(VariationSchema).min(1),
});
