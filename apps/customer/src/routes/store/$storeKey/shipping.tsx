import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/store/$storeKey/shipping')({
  component: () => <div>Hello /store/$storeKey/shipping!</div>
})