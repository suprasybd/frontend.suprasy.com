export interface ProductType {
  Id: number;
  StoreKey: string;
  HasVariant: boolean;
  CategoryId: number;
  Slug: string;
  Title: string;
  Description: string;
  IsActive: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductsVairantsTypes {
  Id: number;
  StoreKey: string;
  ProductId: number;
  Price: number;
  Inventory: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ProductImagesTypes {
  Id: number;
  StoreKey: string;
  ProductId: number;
  Order: number;
  ImageUrl: string;
  CreatedAt: string;
  UpdatedAt: string;
}
