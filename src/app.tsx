import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { routeTree } from './routeTree.gen';
import { useAuthStore } from './store/authStore';
import loadCurrentUser from './config/profile/loadUser';
import { hasCookie } from './config/profile/hasCookie';
import { Toaster } from '@/components/index';

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
    hasCookie: false,
  },
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
const queryClient = new QueryClient();

const App: React.FC = () => {
  const auth = useAuthStore((state) => state);

  useEffect(() => {
    loadCurrentUser();
  }, []);

  const hasCookie_ = hasCookie();

  return (
    <>
      <Toaster />
      <QueryClientProvider client={queryClient}>
        <RouterProvider
          router={router}
          context={{ auth, hasCookie: hasCookie_ }}
        ></RouterProvider>
      </QueryClientProvider>
    </>
  );
};
export default App;
