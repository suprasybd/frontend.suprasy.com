import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/store/$storeKey/customers')({
  component: () => <div>Hello /store/$storeKey/customers!</div>
})