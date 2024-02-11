import ApiClient from '../../../libs/ApiClient';
import { z } from 'zod';
import { SingleResposeType } from '../../../libs/types/responseTypes';
import { loginSchema } from '../zod/loginSchema';

export const login = async (
  data: z.infer<typeof loginSchema>
): Promise<SingleResposeType> => {
  const response = await ApiClient.post('/auth/login', data);

  return response.data;
};
