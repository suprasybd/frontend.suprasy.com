import { Outlet, createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/store')({
  component: () => (
    <div>
      Hello /_store!
      <Outlet />
    </div>
  ),
});
