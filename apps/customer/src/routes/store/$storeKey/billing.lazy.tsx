import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/store/$storeKey/billing')({
  component: () => <div>Hello /store/$storeKey/billing!</div>
})