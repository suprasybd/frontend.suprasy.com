import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';

import { adminThemeSchema } from '../AdminThemes';

export interface ThemeResponse {
  Id: number;
  Name: string;
  Description: string;
  R2Folder: string;
  GithubLink?: string;
  Images: Image[];
}

export interface Image {
  ImageUrl: string;
}

export const createTheme = async (data: any): Promise<ResponseType<string>> => {
  const response = await ApiClient.post('/store/themes', data);
  return response.data;
};

export const updateTheme = async ({
  data,
  themeId,
}: {
  data: any;
  themeId: number;
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.put(`/themes/${themeId}`, data);
  return response.data;
};

export const getThemes = async (): Promise<ListResponseType<ThemeResponse>> => {
  const response = await ApiClient.get('/themes/admin');

  return response.data;
};
