import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/store/$storeKey/_layout/products')({
  component: () => <div>Hello /store/$storeKey/_layout/products!</div>,
});
