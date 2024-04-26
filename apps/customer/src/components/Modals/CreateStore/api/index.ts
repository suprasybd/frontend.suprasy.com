import ApiClient from '@customer/libs/ApiClient';
import { ResponseType } from '@customer/libs/types/responseTypes';

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

export const createStore = async (
  data: FormData
): Promise<ResponseType<string>> => {
  const response = await ApiClient.post('/creator', data);
  return response.data;
};
