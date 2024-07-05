/* eslint-disable @typescript-eslint/no-explicit-any */
import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';

export interface TurnstileType {
  Id: number;
  StoreKey: string;
  TurnstileKey: string;
  TurnstileSecret: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface LogoType {
  Id: number;
  StoreKey: string;
  LogoLink: string;
  FaviconLink: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface DomainType {
  Id: number;
  StoreKey: string;
  DomainName: string;
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

export const getDomain = async (): Promise<ResponseType<DomainType>> => {
  const response = await ApiClient.get(`/turnstile/domain`);

  return response.data;
};

export const updateDomain = async (
  data: any
): Promise<ResponseType<DomainType>> => {
  const response = await ApiClient.put(`/turnstile/domain`, data);

  return response.data;
};

export const getDomains = async (): Promise<ListResponseType<DomainType>> => {
  const response = await ApiClient.get(`/turnstile/domains`);

  return response.data;
};

export const addDomains = async (
  data: any
): Promise<ResponseType<DomainType>> => {
  const response = await ApiClient.post(`/turnstile/domains`, data);

  return response.data;
};

export const getLogo = async (): Promise<ResponseType<LogoType>> => {
  const response = await ApiClient.get(`/logo`);

  return response.data;
};

export const updateLogo = async (
  data: any
): Promise<ResponseType<LogoType>> => {
  const response = await ApiClient.put(`/logo`, data);

  return response.data;
};
