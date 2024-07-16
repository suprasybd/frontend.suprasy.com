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

export const addCategory = async (data: any): Promise<ResponseType<string>> => {
  const response = await ApiClient.post('/categories/add', data);

  return response.data;
};

export const addSubCategory = async ({
  data,
  parentCategory,
}: {
  data: any;
  parentCategory: any;
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.post(
    `/categories/add/${parentCategory}`,
    data
  );

  return response.data;
};

export const updateCategory = async ({
  data,
  id,
}: {
  data: any;
  id: number;
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.put('/categories/update/' + id, data);

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

export const getAllCategories = async (): Promise<
  ListResponseType<Category>
> => {
  const response = await ApiClient.get('/categories/all');

  return response.data;
};

export const getSubCategories = async (
  parentCategory: number
): Promise<ListResponseType<Category>> => {
  const response = await ApiClient.get(`/categories/${parentCategory}`);

  return response.data;
};
