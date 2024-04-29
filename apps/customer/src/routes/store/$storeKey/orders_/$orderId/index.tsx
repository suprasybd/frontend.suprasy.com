import OrderDetails from '@customer/pages/orders/Details/OrderDetails';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/store/$storeKey/orders/$orderId/')({
  component: () => <OrderDetails />,
});
