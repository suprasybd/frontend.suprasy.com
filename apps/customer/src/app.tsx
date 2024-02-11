import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import { routeTree } from './routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuthStore } from './store/authStore';

const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
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
  return (
    <>
      <div></div>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} context={{ auth }}></RouterProvider>
      </QueryClientProvider>
    </>
  );
};
export default App;
