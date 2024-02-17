import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/store/$storeKey/inventory')({
  component: () => <div>Hello /store/$storeKey/inventory!</div>
})