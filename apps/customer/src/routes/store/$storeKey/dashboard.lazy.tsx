import Dashboard from '@customer/pages/dashboard/Dashboard';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/dashboard')({
  component: () => <Dashboard />,
});
