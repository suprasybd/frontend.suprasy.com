import ApiClient from '../../../libs/ApiClient';
import { ListResponseType } from '../../../libs/types/responseTypes';
import { ProductType } from './types';

export const getUserStoresProductsList = async (): Promise<
  ListResponseType<ProductType>
> => {
  const response = await ApiClient.get('/products');

  return response.data;
};
