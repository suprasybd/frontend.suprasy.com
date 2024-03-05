import ApiClient from '../../../libs/ApiClient';
import { ListResponseType } from '../../../libs/types/responseTypes';
import { MultipleVariantsTypes } from '../../products/api/types';

export const getInventoryList = async (): Promise<
  ListResponseType<MultipleVariantsTypes>
> => {
  const response = await ApiClient.get('/inventory/list');
  return response.data;
};
