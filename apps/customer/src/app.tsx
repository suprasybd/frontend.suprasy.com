import { RouterProvider, createRouter } from '@tanstack/react-router';
import React from 'react';
import { routeTree } from './routeTree.gen';

const router = createRouter({ routeTree });

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

const App: React.FC = () => {
  return (
    <>
      <div></div>
      <RouterProvider router={router} />
    </>
  );
};
export default App;
