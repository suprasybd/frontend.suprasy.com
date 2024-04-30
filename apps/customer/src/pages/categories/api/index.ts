import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';

export interface Category {
  Id: number;
  StoreKey: string;
  ParentCategoryId?: number;
  Name: string;
  Icon?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const addCategory = async (
  categoryName: string
): Promise<ResponseType<string>> => {
  const response = await ApiClient.post('/categories/add', {
    CategoryName: categoryName,
  });

  return response.data;
};

export const updateCategory = async ({
  categoryName,
  id,
}: {
  categoryName: string;
  id: number;
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.put('/categories/update/' + id, {
    CategoryName: categoryName,
  });

  return response.data;
};

export const removeCategory = async ({
  id,
}: {
  id: number;
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.delete('/categories/remove/' + id);

  return response.data;
};

export const getCategories = async (): Promise<ListResponseType<Category>> => {
  const response = await ApiClient.get('/categories');

  return response.data;
};
