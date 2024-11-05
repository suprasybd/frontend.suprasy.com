import Orders from '@/pages/orders/Orders';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/orders')({
  component: () => <Orders />,
});
