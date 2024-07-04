import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';
import { z } from 'zod';
import { pageSchema } from '../CreatePage/CreatePage';
export interface Footer {
  Id: number;
  StoreKey: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Page {
  Id: number;
  StoreKey: string;
  Url: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getFooter = async (): Promise<ResponseType<Footer>> => {
  const response = await ApiClient.get('/footer');

  return response.data;
};

export const updateFooter = async ({
  Description,
}: {
  Description: string;
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.put('/footer', { Description });

  return response.data;
};

export const createPage = async (data: any): Promise<ResponseType<string>> => {
  const response = await ApiClient.post('/footer/addpage', data);

  return response.data;
};

export const getPage = async (id: number): Promise<ResponseType<Page>> => {
  const response = await ApiClient.get('/footer/getpage/' + id);

  return response.data;
};

export const getAllPage = async (): Promise<ListResponseType<Page>> => {
  const response = await ApiClient.get('/footer/getallpage');

  return response.data;
};

export const updatePage = async ({
  data,
  id,
}: {
  id: number;
  data: any;
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.put('/footer/updatepage/' + id, data);

  return response.data;
};
