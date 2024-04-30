import StoreHome from '@customer/pages/StoreHome/StoreHome';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/home')({
  component: () => <StoreHome />,
});
