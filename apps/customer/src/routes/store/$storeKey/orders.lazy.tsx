import Orders from '@customer/pages/orders/Orders';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/orders')({
  component: () => <Orders />,
});
