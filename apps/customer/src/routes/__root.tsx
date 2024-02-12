import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import { AuthStoreType } from '../store/authStore';

interface MyRouterContext {
  auth: AuthStoreType | undefined;
  hasCookie: boolean;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <div className="flex gap-2">
        <Outlet />
      </div>

      <TanStackRouterDevtools />
    </>
  ),
});
