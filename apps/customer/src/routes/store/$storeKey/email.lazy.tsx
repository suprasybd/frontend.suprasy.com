import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/email')({
  component: () => <div>Hello /store/$storeKey/email!</div>,
});
