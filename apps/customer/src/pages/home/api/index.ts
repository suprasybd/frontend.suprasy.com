import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';
import { BalanceResponseType, StoreType } from './types';

export const getUserStoresList = async (): Promise<
  ListResponseType<StoreType>
> => {
  const response = await ApiClient.get('/store/list');

  return response.data;
};

export const getUserBalance = async (): Promise<
  ResponseType<BalanceResponseType>
> => {
  const response = await ApiClient.get('/balance');

  return response.data;
};
