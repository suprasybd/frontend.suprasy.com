import ApiClient from '../../../libs/ApiClient';
import { ListResponseType } from '../../../libs/types/responseTypes';

export interface GuestThemeType {
  Id: number;
  Name: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ThemeImageType {
  Id: number;
  ImageUrl: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getGuestThemes = async (): Promise<
  ListResponseType<GuestThemeType>
> => {
  const response = await ApiClient.get('/themes');
  return response.data;
};

export const getThemeImages = async (
  themeId: number
): Promise<ListResponseType<ThemeImageType>> => {
  const response = await ApiClient.get(`/themes/${themeId}/images`);
  return response.data;
};
