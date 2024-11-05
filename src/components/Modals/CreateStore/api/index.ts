import ApiClient from '@/libs/ApiClient';
import { ResponseType } from '@/libs/types/responseTypes';

export interface StoreImageType {
  Id: number;
  StoreKey: string;
  UserId: number;
  ImageUrl: string;
  ImageKey: string;
  Size: number;
  CreatedAt: string;
  UpdatedAt: string;
}

interface CreateStoreData {
  StoreName: string;
  SubDomain: string;
  planId: number;
}

export const createStore = async (
  data: CreateStoreData
): Promise<ResponseType<string>> => {
  const response = await ApiClient.post('/creator', data);
  return response.data;
};
