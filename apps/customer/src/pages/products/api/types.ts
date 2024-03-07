export interface ProductType {
  Id: string;
  StoreKey: string;
  HasVariant: boolean;
  CategoryId: string;
  Slug: string;
  Title: string;
  Description: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductsVairantsTypes {
  Id: string;
  StoreKey: string;
  ProductId: string;
  Price: number;
  Inventory: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductImagesTypes {
  Id: string;
  StoreKey: string;
  ProductId: string;
  Order: number;
  ImageUrl: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// OPTIONS - Option - Value (size - lg)
export interface Options {
  storefront_options: StorefrontOptions;
  storefront_options_value: StorefrontOptionsValue;
}

export interface StorefrontOptions {
  Id: string;
  StoreKey: string;
  ProductId: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontOptionsValue {
  Id: string;
  StoreKey: string;
  OptionId: string;
  Value: string;
  CreatedAt: string;
  UpdatedAt: string;
}

// Multiple Variants (HasVariants: True)

export interface MultipleVariantsTypes {
  storefront_variants: StorefrontVariants;
  storefront_variants_options: StorefrontVariantsOptions;
  storefront_options: StorefrontOptions;
  storefront_options_value: StorefrontOptionsValue;
}

export interface StorefrontVariants {
  Id: string;
  StoreKey: string;
  ProductId: string;
  Price: number;
  Inventory: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontVariantsOptions {
  Id: string;
  StoreKey: string;
  VariantId: string;
  OptionId: string;
  ValueId: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontOptions {
  Id: string;
  StoreKey: string;
  ProductId: string;
  Name: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface StorefrontOptionsValue {
  Id: string;
  StoreKey: string;
  OptionId: string;
  Value: string;
  CreatedAt: string;
  UpdatedAt: string;
}
