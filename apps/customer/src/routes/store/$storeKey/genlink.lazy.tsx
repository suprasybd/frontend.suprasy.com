import GenLink from '@customer/pages/genlink/GenLink';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/store/$storeKey/genlink')({
  component: () => <GenLink />,
});
