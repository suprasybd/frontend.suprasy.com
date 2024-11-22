import { z } from 'zod';

export const OptionSchema = z.object({
  OptionName: z.string(),
  Value: z.string(),
});

const ImageUrl = z.object({
  ImageUrl: z.string().url({
    message: 'Please enter a valid image URL',
  }),
});

const VariationSchema = z.object({
  Id: z.number().optional(),
  ChoiceName: z.string().min(1, {
    message: 'Variation name is required',
  }),
  Price: z.coerce.number().min(0, {
    message: 'Price must be greater than or equal to 0',
  }),
  SalesPrice: z.coerce.number().min(0, {
    message: 'Sales price must be greater than or equal to 0',
  }),
  Sku: z.string().min(1, {
    message: 'SKU is required',
  }),
  Inventory: z.coerce.number().min(0, {
    message: 'Inventory must be greater than or equal to 0',
  }),
  Images: z.array(ImageUrl).min(1, {
    message: 'At least one image is required',
  }),
  Deleted: z.boolean().default(false),
});

export const productSchema = z.object({
  CategoryId: z.number().optional(),
  Slug: z.string().min(1, {
    message: 'Slug is required',
  }),
  Title: z.string().min(1, {
    message: 'Title is required',
  }),
  Description: z.string().refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return parsed && parsed.length > 0;
      } catch {
        return val.length > 0;
      }
    },
    {
      message: 'Description is required',
    }
  ),
  Summary: z.string().refine(
    (val) => {
      try {
        const parsed = JSON.parse(val);
        return parsed && parsed.length > 0;
      } catch {
        return val.length > 0;
      }
    },
    {
      message: 'Summary is required',
    }
  ),
  Status: z.string().min(1, {
    message: 'Status is required',
  }),
  ProductVariations: z.array(VariationSchema).min(1, {
    message: 'At least one variation is required',
  }),
});

export type ProductSchemaType = z.infer<typeof productSchema>;
