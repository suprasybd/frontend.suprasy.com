import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/store/$storeKey/analytics')({
  component: () => <div>Hello /store/$storeKey/analytics!</div>
})