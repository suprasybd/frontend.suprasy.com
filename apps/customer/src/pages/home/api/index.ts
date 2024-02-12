import ApiClient from '../../../libs/ApiClient';
import { ListResponseType } from '../../../libs/types/responseTypes';
import { StoreType } from './types';

export const getUserStoresList = async (): Promise<
  ListResponseType<StoreType>
> => {
  const response = await ApiClient.get('/store/list');

  return response.data;
};
