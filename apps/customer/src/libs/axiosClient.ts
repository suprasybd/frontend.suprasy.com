import axios, { AxiosError, AxiosResponse } from 'axios';

import { accessTokenHandler } from './api/TokenHandler';
import errorResponseHandler from './api/ResponseHandler';
import { SUPRASY_API_URL } from '../config/api';

const SuprasyApiHost = SUPRASY_API_URL;

const MainApi = axios.create({
  baseURL: SuprasyApiHost,
});

MainApi.interceptors.request.use((request) => {
  accessTokenHandler(request);
  return request;
});

MainApi.interceptors.response.use(
  (response: AxiosResponse) => Promise.resolve(response),
  (error: AxiosError) => {
    void errorResponseHandler(error);
    return Promise.reject(error);
  }
);

export default MainApi;
