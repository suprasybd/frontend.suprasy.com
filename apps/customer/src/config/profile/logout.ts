import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '../../store/authStore';
import { cleanRemoveTokens } from '../../libs/api/ResponseHandler';

export const logoutUser = () => {
  useAuthStore.getState().logout();
  cleanRemoveTokens();
  redirect({ to: '/login' });
};
