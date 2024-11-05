import ApiClient from '@/libs/ApiClient';
import { ResponseType } from '@/libs/types/responseTypes';

export const updateOrder = async ({
  orderId,
  status,
  note,
}: {
  note: string;
  status: string;
  orderId: number;
}): Promise<ResponseType<string>> => {
  const response = await ApiClient.put('/orders/' + orderId, {
    Status: status,
    Note: note,
  });
  return response.data;
};
