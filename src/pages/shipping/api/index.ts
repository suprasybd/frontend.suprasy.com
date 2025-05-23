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
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface ShippingMethodType {
  Id: number;
  StoreKey: string;
  DeliveryMethod: string;
  Cost: number;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export interface PaymentMethodType {
  Id: number;
  PaymentMethod: string;
  Description: string;
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
  Description: string;
}): Promise<ResponseType<AreaType>> => {
  const response = await ApiClient.post(`/shipping/add-area`, data);

  return response.data;
};

export const updateArea = async (data: {
  Id: number;
  Area: string;
  Cost: number;
  Description: string;
}): Promise<ResponseType<AreaType>> => {
  const response = await ApiClient.put(
    `/shipping/update-area/${data.Id}`,
    data
  );

  return response.data;
};

export const deleteArea = async (
  Id: number
): Promise<ResponseType<AreaType>> => {
  const response = await ApiClient.delete(`/shipping/delete-area/${Id}`);

  return response.data;
};

// SHIPPING _ METHODS
// METHOD

export const getMethodsList = async (): Promise<
  ListResponseType<ShippingMethodType>
> => {
  const response = await ApiClient.get(`/shipping/get-methods`);

  return response.data;
};

export const getMethodById = async (
  methodId: number
): Promise<ResponseType<ShippingMethodType>> => {
  const response = await ApiClient.get(`/shipping/get-method/${methodId}`);

  return response.data;
};

export const addMethod = async (data: {
  DeliveryMethod: string;
  Cost: number;
  Description: string;
}): Promise<ResponseType<ShippingMethodType>> => {
  const response = await ApiClient.post(`/shipping/add-method`, data);

  return response.data;
};

export const updateMethod = async (data: {
  Id: number;
  DeliveryMethod: string;
  Cost: number;
  Description: string;
}): Promise<ResponseType<ShippingMethodType>> => {
  const response = await ApiClient.put(
    `/shipping/update-method/${data.Id}`,
    data
  );

  return response.data;
};

export const deleteMethod = async (
  Id: number
): Promise<ResponseType<ShippingMethodType>> => {
  const response = await ApiClient.delete(`/shipping/delete-method/${Id}`);

  return response.data;
};

export const getPaymentsList = async (): Promise<
  ListResponseType<PaymentMethodType>
> => {
  const response = await ApiClient.get(`/shipping/get-payments`);
  return response.data;
};

export const getPaymentById = async (
  paymentId: number
): Promise<ResponseType<PaymentMethodType>> => {
  const response = await ApiClient.get(`/shipping/get-payment/${paymentId}`);
  return response.data;
};

export const addPayment = async (data: {
  PaymentMethod: string;
  Description: string;
}): Promise<ResponseType<PaymentMethodType>> => {
  const response = await ApiClient.post(`/shipping/add-payment`, data);
  return response.data;
};

export const updatePayment = async (data: {
  Id: number;
  PaymentMethod: string;
  Description: string;
}): Promise<ResponseType<PaymentMethodType>> => {
  const response = await ApiClient.put(
    `/shipping/update-payment/${data.Id}`,
    data
  );
  return response.data;
};

export const deletePayment = async (
  Id: number
): Promise<ResponseType<PaymentMethodType>> => {
  const response = await ApiClient.delete(`/shipping/delete-payment/${Id}`);
  return response.data;
};
