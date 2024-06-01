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
  ProductsVairantsTypes,
} from './types';
import { productSchema } from '../create/zod/productSchema';

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

export const getProductsVariantsDetails = async (
  productId: number
): Promise<ResponseType<ProductsVairantsTypes>> => {
  const response = await ApiClient.get(`/products/variants/${productId}`);

  return response.data;
};

export const getProductsImages = async (
  productId: number
): Promise<ListResponseType<ProductImagesTypes>> => {
  const response = await ApiClient.get(`/products/images/${productId}`);

  return response.data;
};

export const getProductAttributes = async (
  productId: number
): Promise<ResponseType<ProductAttributeTypes>> => {
  const response = await ApiClient.get(`/products/attribute/${productId}`);

  return response.data;
};

export const getProductSku = async (
  productId: number
): Promise<ResponseType<ProductSku>> => {
  const response = await ApiClient.get(`/inventory/sku/${productId}`);

  return response.data;
};

export const getProudcctsOptions = async (
  productId: number
): Promise<ListResponseType<Options>> => {
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
