import CustomersPage from '@customer/pages/customers/Customers';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/customers')({
  component: () => <CustomersPage />,
});
