import ApiClient from '@customer/libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '@customer/libs/types/responseTypes';

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

export const uplaodImageToStore = async (
  data: FormData
): Promise<ResponseType<string>> => {
  const response = await ApiClient.post('/images/upload', data);
  return response.data;
};

export const getStoreImages = async (
  Page: number,
  Limit: number
): Promise<ListResponseType<StoreImageType>> => {
  const response = await ApiClient.get('/images/get-list', {
    params: {
      Page,
      Limit,
    },
  });

  return response.data;
};
