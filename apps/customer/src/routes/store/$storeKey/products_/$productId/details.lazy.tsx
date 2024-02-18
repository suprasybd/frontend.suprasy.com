import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/store/$storeKey/products/$productId/details')({
  component: () => <div>Hello /store/$storeKey/products/$productId/details!</div>
})