import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';

export interface HomeSectionsTypes {
  Id: number;
  StoreKey: string;
  Title: string;
  Description: string;
  ViewAllLink: any;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface SectionProductsType {
  Id: number;
  StoreKey: string;
  ProductId: number;
  SectionId: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface Hero {
  Id: number;
  ImageLink: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const createSectionPost = async (
  data: any
): Promise<ResponseType<string>> => {
  const response = await ApiClient.post('/homesections/add-section', data);

  return response.data;
};

export const updateSectionPost = async ({
  data,
  sectionId,
}: {
  data: any;
  sectionId: number;
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.put(
    '/homesections/update-section/' + sectionId,
    data
  );

  return response.data;
};

export const getHomeSections = async (): Promise<
  ListResponseType<HomeSectionsTypes>
> => {
  const response = await ApiClient.get('/homesections');

  return response.data;
};

export const getHomesectionsProducts = async (
  sectionId: number
): Promise<ListResponseType<SectionProductsType>> => {
  const response = await ApiClient.get(
    '/homesections/getsectionproducts/' + sectionId
  );

  return response.data;
};

export const getSectionById = async (
  sectionId: number
): Promise<ResponseType<HomeSectionsTypes>> => {
  const response = await ApiClient.get('/homesections/getsection/' + sectionId);

  return response.data;
};

export const deleteSection = async (
  sectionId: number
): Promise<ListResponseType<SectionProductsType>> => {
  const response = await ApiClient.delete(
    '/homesections/delete-section/' + sectionId
  );

  return response.data;
};

export const getHero = async (): Promise<ListResponseType<Hero>> => {
  const response = await ApiClient.get('/hero/get');

  return response.data;
};

export const createHero = async ({
  data,
}: {
  data: { Images: Array<{ ImageLink: string }> };
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.post('/hero/add', data);

  return response.data;
};

export const updateHero = async ({
  data,
}: any): Promise<ResponseType<string>> => {
  const response = await ApiClient.put('/hero/update', data);

  return response.data;
};
