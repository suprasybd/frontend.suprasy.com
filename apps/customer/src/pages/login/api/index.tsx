import ApiClient from '../../../libs/ApiClient';
import { z } from 'zod';
import { SingleResposeType } from '../../../libs/types/responseTypes';
import { loginSchema } from '../zod/loginSchema';
import Cookie from 'js-cookie';
import { SITE_URL } from '../../../../src/config/api';
import { useAuthStore } from '../../../../src/store/authStore';

export const login = async (
  data: z.infer<typeof loginSchema>
): Promise<SingleResposeType> => {
  const response = await ApiClient.post('/auth/login', data);
  console.log(response);
  const accessToken = response.data?.Token;
  const userDetails = JSON.stringify(response.data?.Data);
  const user = response.data?.Data;
  if (accessToken) {
    Cookie.set('accessToken', accessToken as string, {
      domain: SITE_URL,
      path: '/',
    });
  }
  if (userDetails) {
    Cookie.set('userDetails', userDetails, {
      domain: SITE_URL,
      path: '/',
    });
  }
  if (user && accessToken) {
    useAuthStore.getState().login(user);
  }
  return response.data;
};
