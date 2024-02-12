import { redirect } from '@tanstack/react-router';
import { useAuthStore } from '../../store/authStore';

export const logoutUser = () => {
  useAuthStore.getState().logout();
  redirect({ to: '/login' });
};
