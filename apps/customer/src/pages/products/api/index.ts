import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';
import { ProductType } from './types';
import { productSchema } from '../create/zod/productSchema';
export const getUserStoresProductsList = async (): Promise<
  ListResponseType<ProductType>
> => {
  const response = await ApiClient.get('/products');

  return response.data;
};

export const createStoresProduct = async (
  data: typeof productSchema
): Promise<ResponseType<string>> => {
  const response = await ApiClient.post('/products', data);
  return response.data;
};

export const getProductsDetails = async (
  productId: number
): Promise<ResponseType<ProductType>> => {
  const response = await ApiClient.get(`/products/${productId}`);

  return response.data;
};
