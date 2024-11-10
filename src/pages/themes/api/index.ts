import ApiClient from '../../../libs/ApiClient';
import { ListResponseType } from '../../../libs/types/responseTypes';
import { getSubDetails, getPlan } from '../../home/api';

export interface GuestThemeType {
  Id: number;
  Name: string;
  Description: string;
  Type: 'free' | 'paid';
  GithubLink?: string;
  PreviewUrl?: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ThemeImageType {
  Id: number;
  ImageUrl: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getGuestThemes = async (params?: {
  Page?: number;
  Limit?: number;
}): Promise<ListResponseType<GuestThemeType>> => {
  const response = await ApiClient.get('/themes', {
    params,
  });
  return response.data;
};

export const getThemeImages = async (
  themeId: number
): Promise<ListResponseType<ThemeImageType>> => {
  const response = await ApiClient.get(`/themes/${themeId}/images`);
  return response.data;
};

export { getSubDetails, getPlan };
