import { Outlet, createFileRoute, redirect } from '@tanstack/react-router';
import StoreSidebar from '../components/StoreSidebar/StoreSidebar';

export const Route = createFileRoute('/store')({
  beforeLoad: async ({ context }) => {
    if (context && !context.hasCookie) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: () => (
    <div className="flex gap-2">
      <StoreSidebar />
      <Outlet />
    </div>
  ),
});
