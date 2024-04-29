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
  FirstName: string;
  LastName: string;
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
