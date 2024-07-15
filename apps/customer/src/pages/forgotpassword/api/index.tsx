import ApiClient from '../../../libs/ApiClient';
import { z } from 'zod';
import { SingleResposeType } from '../../../libs/types/responseTypes';
import { resetSchema } from '../zod/passwordResetSchema';

export const resetPassword = async (
  data: z.infer<typeof resetSchema>
): Promise<SingleResposeType> => {
  const response = await ApiClient.post(`/auth/passwordreset/${data.Email}`);

  return response.data;
};
