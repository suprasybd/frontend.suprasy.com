import { SUPRASY_API_URL } from '@/config/api';
import { ResponseType } from '@/libs/types/responseTypes';
import { ProductType } from '@/pages/products/api/types';
import axios from 'axios';

export const getSFProductsDetailsById = async ({
  id,
  StoreKey,
}: {
  id: number;
  StoreKey: string;
}): Promise<ResponseType<ProductType>> => {
  const response = await axios.get(
    `${SUPRASY_API_URL}/storefront-products/product-id/${id}`,
    {
      headers: {
        StoreKey,
      },
    }
  );

  return response.data;
};
