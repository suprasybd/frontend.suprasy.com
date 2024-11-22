import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import React, { useEffect } from 'react';
import { routeTree } from './routeTree.gen';
import { useAuthStore } from './store/authStore';
import loadCurrentUser from './config/profile/loadUser';
import { hasCookie } from './config/profile/hasCookie';
import { Toaster } from '@/components/index';

// Add Tawk.to chat widget
const initTawkTo = () => {
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = 'https://embed.tawk.to/667d7627eaf3bd8d4d150266/1i1d1b2m5';
  script.charset = 'UTF-8';
  script.setAttribute('crossorigin', '*');
  document.body.appendChild(script);
};

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
    initTawkTo(); // Initialize Tawk.to chat widget
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
