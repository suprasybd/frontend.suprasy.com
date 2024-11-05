import ApiClient from '../../../libs/ApiClient';
import { z } from 'zod';
import { SingleResposeType } from '../../../libs/types/responseTypes';
import { resetPasswordSchema } from '../zod/passwordResetSchema';

export const resetCompletePassword = async (
  data: z.infer<typeof resetPasswordSchema>
): Promise<SingleResposeType> => {
  const response = await ApiClient.post(`/auth/passwordreset`, data);

  return response.data;
};
