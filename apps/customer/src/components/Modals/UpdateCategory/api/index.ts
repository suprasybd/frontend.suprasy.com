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

export const updateProductCateogry = async ({
  categoryId,
  productId,
}: {
  productId: number;
  categoryId: number;
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.put(
    '/products/categoryUpdate/' + productId,
    { CategoryId: categoryId }
  );
  return response.data;
};
