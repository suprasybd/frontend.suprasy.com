import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/store/$storeKey/payments')({
  component: () => <div>Hello /store/$storeKey/payments!</div>
})