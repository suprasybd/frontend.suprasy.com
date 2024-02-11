import { AxiosError } from 'axios';
import Cookie from 'js-cookie';
import { useAuthStore } from '../../store/authStore';

const cleanRemoveTokens = () => {
  Cookie.remove('accessToken', { domain: '.suprasy.com' });
};

const errorResponseHandler = async (error: AxiosError) => {
  if (error.response) {
    const { status } = error.response;
    if (status === 401) {
      // LOGOUT
      cleanRemoveTokens();
      useAuthStore.getState().logout();
    }
  }
  return error;
};

export default errorResponseHandler;
