import Landing from '@customer/pages/landing/Landing';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/store/$storeKey/landing')({
  component: () => <Landing />,
});
