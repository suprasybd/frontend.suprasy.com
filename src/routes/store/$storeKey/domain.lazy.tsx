import Domain from '@/pages/domain/Domain';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/domain')({
  component: () => <Domain />,
});
