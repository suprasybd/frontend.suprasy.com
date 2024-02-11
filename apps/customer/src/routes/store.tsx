import { Outlet, createFileRoute } from '@tanstack/react-router';
import StoreSidebar from '../components/StoreSidebar/StoreSidebar';

export const Route = createFileRoute('/store')({
  component: () => (
    <div className="flex gap-2">
      <StoreSidebar />
      <Outlet />
    </div>
  ),
});
