import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';
import {
  MultipleVariantsTypes,
  Options,
  ProductAttributeTypes,
  ProductImagesTypes,
  ProductSku,
  ProductType,
  ProductVariationType,
} from './types';
import { productSchema } from '../create/zod/productSchema';

export interface AttributeValue {
  Id: number;
  StoreKey: string;
  AttributeId: number;
  ProductId: number;
  Value: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getUserStoresProductsList = async (Queries: {
  [key: string]: any;
  Page?: number;
  Limit?: number;
  Status?: string;
}): Promise<ListResponseType<ProductType>> => {
  const response = await ApiClient.get('/products', {
    params: Queries,
  });

  return response.data;
};

export const createStoresProduct = async (
  data: typeof productSchema
): Promise<ResponseType<string>> => {
  const response = await ApiClient.post('/products', data);
  return response.data;
};

export const updateStoresProduct = async (data: {
  data: typeof productSchema;
  productId: number;
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.put(
    `/products/${data.productId}`,
    data.data
  );
  return response.data;
};

export const getProductsDetails = async (
  productId: number
): Promise<ResponseType<ProductType>> => {
  const response = await ApiClient.get(`/products/${productId}`);

  return response.data;
};

export const getVariationDetails = async (
  variationId: number
): Promise<ResponseType<ProductVariationType>> => {
  const response = await ApiClient.get(`/products/variation-id/${variationId}`);

  return response.data;
};

export const getProductsImages = async (
  variationId: number
): Promise<ListResponseType<ProductImagesTypes>> => {
  const response = await ApiClient.get(`/products/images/${variationId}`);

  return response.data;
};

export const getVariations = async (
  productId: number
): Promise<ListResponseType<ProductVariationType>> => {
  const response = await ApiClient.get(`/products/variations/${productId}`);

  return response.data;
};

export const getProductAttributes = async (
  productId: number
): Promise<ResponseType<ProductAttributeTypes>> => {
  const response = await ApiClient.get(`/products/attribute/${productId}`);

  return response.data;
};
export const getProductOptions = async (
  productId: number
): Promise<ListResponseType<AttributeValue>> => {
  const response = await ApiClient.get(`/products/options/${productId}`);

  return response.data;
};

export const getProductsMultipleVariants = async (
  productId: number
): Promise<ListResponseType<MultipleVariantsTypes>> => {
  const response = await ApiClient.get(
    `/products/multiplevairants/${productId}`
  );

  return response.data;
};

export const deleteProduct = async (
  productId: number
): Promise<ResponseType<ProductType>> => {
  const response = await ApiClient.delete(`/products/${productId}`);

  return response.data;
};

export const getAllCategories = async (): Promise<
  ResponseType<CategoryType[]>
> => {
  const response = await ApiClient.get('/categories/all');
  return response.data;
};

export interface CategoryType {
  Id: number;
  ParentCategoryId: number | null;
  Name: string;
  Icon: string | null;
  Thumbnail: string | null;
  Deleted: boolean;
  CreatedAt: string;
  UpdatedAt: string;
}
