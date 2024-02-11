import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/store/$storeKey/_layout')({
  component: () => (
    <div>
      Hello /store/$storeKey/_layout!
      <Outlet />
    </div>
  ),
});
