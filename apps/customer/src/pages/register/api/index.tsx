import ApiClient from '../../../libs/ApiClient';
import { z } from 'zod';
import { SingleResposeType } from '../../../libs/types/responseTypes';
import { registerSchema } from '../zod/registerSchema';

export const register = async (
  data: z.infer<typeof registerSchema>
): Promise<SingleResposeType> => {
  const response = await ApiClient.post('/auth/register', data);

  return response.data;
};
