import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/store/$storeKey/domain')({
  component: () => <div>Hello /store/$storeKey/domain!</div>
})