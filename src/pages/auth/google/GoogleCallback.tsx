import { useNavigate, useSearch } from '@tanstack/react-router';
import { useEffect } from 'react';
import Cookie from 'js-cookie';
import { SITE_URL } from '@/config/api';
import { useAuthStore } from '@/store/authStore';
import { useToast } from '@/components/index';

const GoogleCallback = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: '/auth/google/callback' });
  const { toast } = useToast();

  useEffect(() => {
    try {
      const token = (search as any).token;
      const userDataStr = (search as any).user;

      if (!token || !userDataStr) {
        throw new Error('Missing authentication data');
      }

      // The user data is already an object, no need to parse
      const userData =
        typeof userDataStr === 'string' ? JSON.parse(userDataStr) : userDataStr;

      // Set cookies similar to regular login
      Cookie.set('accessToken', token, {
        domain: SITE_URL,
        path: '/',
      });

      Cookie.set('userDetails', JSON.stringify(userData), {
        domain: SITE_URL,
        path: '/',
      });

      // Update auth store
      useAuthStore.getState().login(userData);
    } catch (error) {
      console.error('Google auth callback error:', error);
      toast({
        title: 'Authentication Failed',
        description: 'Failed to complete Google sign in. Please try again.',
        variant: 'destructive',
      });
      navigate({ to: '/login' });
    }
  }, [navigate, search, toast]);

  return (
    <div className="flex min-h-full flex-col justify-center items-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      <p className="mt-4 text-gray-600">Completing sign in...</p>
    </div>
  );
};

export default GoogleCallback;
