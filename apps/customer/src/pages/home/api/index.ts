import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';
import { BalanceResponseType, PlanResponseType, StoreType } from './types';

export const getUserStoresList = async (): Promise<
  ListResponseType<StoreType>
> => {
  const response = await ApiClient.get('/store/list');

  return response.data;
};

export const getStoreDetails = async (
  StoreKey: string
): Promise<ResponseType<StoreType>> => {
  const response = await ApiClient.get('/store/details/' + StoreKey);
  return response.data;
};

export const getUserBalance = async (): Promise<
  ResponseType<BalanceResponseType>
> => {
  const response = await ApiClient.get('/billing/balance');

  return response.data;
};

export const getPlan = async (): Promise<ResponseType<PlanResponseType>> => {
  const response = await ApiClient.get('/billing/plan');

  return response.data;
};
