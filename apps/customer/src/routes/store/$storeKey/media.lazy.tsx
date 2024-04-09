import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/store/$storeKey/media')({
  component: () => <div>Hello /store/$storeKey/media!</div>
})