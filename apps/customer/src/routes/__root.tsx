import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import Sidebar from '../components/Sidebar/Sidebar';

export const Route = createRootRoute({
  component: () => (
    <>
      <div className="flex gap-2">
        <Sidebar />
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </>
  ),
});
