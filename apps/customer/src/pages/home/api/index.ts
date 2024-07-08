import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';
import {
  BalanceResponseType,
  PlanResponseType,
  StoreType,
  SubscriptionType,
} from './types';

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

export const getSubDetails = async (
  StoreKey: string
): Promise<ResponseType<SubscriptionType>> => {
  const response = await ApiClient.get('/store/sub/' + StoreKey);
  return response.data;
};

export const renewSubscription = async (
  StoreKey: string
): Promise<ResponseType<StoreType>> => {
  const response = await ApiClient.get('/store/renew/' + StoreKey);
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
