import Cookies from 'js-cookie';
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export const accessTokenHandler = (request: AxiosRequestConfig): void => {
  const accessToken = Cookies.get('accessToken') as string;
  (request.headers as AxiosRequestHeaders).Authorization = accessToken
    ? `Bearer ${accessToken}`
    : '';
};
