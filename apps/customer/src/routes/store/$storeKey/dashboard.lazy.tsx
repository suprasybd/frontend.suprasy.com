import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/dashboard')({
  component: () => <div>Hello /store/$storeKey/dashbaord!</div>,
});
