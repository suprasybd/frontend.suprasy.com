import { UserType } from '@/store/interfaces/userInterface';
import ApiClient from '../../../libs/ApiClient';
import {
  ListResponseType,
  ResponseType,
} from '../../../libs/types/responseTypes';

export interface CustomerType {
  Email: string;
  IsVerified: boolean;
  CreatedAt: string;
  UpdatedAt: string;
  FullName: string;
}

export const getStoreCustomers = async (Queries: {
  [key: string]: any;
  Page?: number;
  Limit?: number;
}): Promise<ListResponseType<CustomerType>> => {
  const response = await ApiClient.get('/auth/customers', {
    params: Queries,
  });

  return response.data;
};
