/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiClient from '../../../libs/ApiClient';
import { ResponseType } from '../../../libs/types/responseTypes';

export interface TurnstileType {
  Id: number;
  StoreKey: string;
  TurnstileKey: string;
  TurnstileSecret: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getTurnstile = async (): Promise<ResponseType<TurnstileType>> => {
  const response = await ApiClient.get(`/turnstile`);

  return response.data;
};

export const updateTurnstile = async (
  data: any
): Promise<ResponseType<TurnstileType>> => {
  const response = await ApiClient.put(`/turnstile`, data);

  return response.data;
};
