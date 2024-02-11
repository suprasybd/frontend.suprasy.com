import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/orders')({
  component: () => <div>Hello /store/$storeKey/orders!</div>,
});
