import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';

export interface AreaType {
  Id: number;
  StoreKey: string;
  Area: string;
  Cost: number;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getAreasList = async (): Promise<ListResponseType<AreaType>> => {
  const response = await ApiClient.get(`/shipping/get-areas`);

  return response.data;
};

export const getAreasById = async (
  areaId: number
): Promise<ResponseType<AreaType>> => {
  const response = await ApiClient.get(`/shipping/get-area/${areaId}`);

  return response.data;
};

export const addArea = async (data: {
  Area: string;
  Cost: number;
}): Promise<ResponseType<AreaType>> => {
  const response = await ApiClient.post(`/shipping/add-area`, data);

  return response.data;
};

export const updateArea = async (data: {
  Id: number;
  Area: string;
  Cost: number;
}): Promise<ResponseType<AreaType>> => {
  const response = await ApiClient.put(
    `/shipping/update-area/${data.Id}`,
    data
  );

  return response.data;
};
