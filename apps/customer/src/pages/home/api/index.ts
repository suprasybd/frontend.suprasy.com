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

interface ThemeType {
  Id: number;
  Name: string;
  Description: number;
  Thumbnail: string;
  CreatedAt: string;
  UpdatedAt: string;
}

interface ThemeVersionType {
  Id: number;
  ThemeId: number;
  Version: number;
  R2FolderName: number;
  CreatedAt: string;
  UpdatedAt: string;
}

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

export const getThemes = async (Queries: {
  [key: string]: any;
  Page?: number;
  Limit?: number;
}): Promise<ListResponseType<ThemeType>> => {
  const response = await ApiClient.get('/store/themes', {
    params: Queries,
  });

  return response.data;
};

export const getThemeVersion = async (
  ThemeId: number
): Promise<ListResponseType<ThemeVersionType>> => {
  const response = await ApiClient.get(`/store/themes/${ThemeId}`);
  return response.data;
};

export const switchTheme = async (
  ThemeVersionId: number
): Promise<ResponseType<string>> => {
  const response = await ApiClient.post(
    `/store/themes/switch/${ThemeVersionId}`
  );
  return response.data;
};

export const getUserBalance = async (): Promise<
  ResponseType<BalanceResponseType>
> => {
  const response = await ApiClient.get('/billing/balance');

  return response.data;
};

export const getPlan = async (): Promise<PlanResponseType> => {
  const response = await ApiClient.get('/plans');
  return response.data;
};
