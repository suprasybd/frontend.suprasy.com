import Cookies from 'js-cookie';
import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

export const accessTokenHandler = (request: AxiosRequestConfig): void => {
  const accessToken = Cookies.get('accessToken') as string;
  const storeKey = Cookies.get('storeKey') as string;
  (request.headers as AxiosRequestHeaders).Authorization = accessToken
    ? `Bearer ${accessToken}`
    : '';
  (request.headers as AxiosRequestHeaders).StoreKey = storeKey || '';
};
