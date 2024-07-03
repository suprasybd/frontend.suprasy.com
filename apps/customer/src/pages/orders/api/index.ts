import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';

export interface OrderType {
  Id: number;
  StoreKey: string;
  OrderMethod: string;
  UserId: number;
  FullName: string;
  Address: string;
  Phone: string;
  Email: string;
  DeliveryMethod: string;
  DeliveryMethodPrice: number;
  ShippingMethod: string;
  ShippingMethodPrice: number;
  PaymentType: string;
  Status: string;
  CreatedAt: string;
  Note: string;
  UpdatedAt: string;
}

export interface OrderProductsType {
  Id: number;
  StoreKey: string;
  OrderId: number;
  ProductId: number;
  Price: number;
  Quantity: number;
  ProductAttribute: string;
  CreatedAt: string;
  UpdatedAt: string;
}

export const getStoreOrders = async (Queries: {
  [key: string]: any;
  Page?: number;
  Limit?: number;
  Status?: string;
}): Promise<ListResponseType<OrderType>> => {
  const response = await ApiClient.get('/orders/all', {
    params: Queries,
  });

  return response.data;
};

export const getOrderById = async (
  orderId: string
): Promise<ResponseType<OrderType>> => {
  const response = await await ApiClient.get('/orders/' + orderId);

  return response.data;
};

export const getOrderProductsById = async (
  orderId: string
): Promise<ListResponseType<OrderProductsType>> => {
  const response = await await ApiClient.get('/orders/products/' + orderId);

  return response.data;
};
