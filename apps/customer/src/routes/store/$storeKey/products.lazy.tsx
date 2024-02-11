import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/store/$storeKey/products')({
  component: () => <div>Hello /store/$storeKey/products!</div>
})