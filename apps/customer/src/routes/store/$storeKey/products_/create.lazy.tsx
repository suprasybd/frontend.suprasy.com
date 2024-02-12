import { createLazyFileRoute } from '@tanstack/react-router';
import CreateProduct from '../../../../pages/products/create/CreateProduct';

export const Route = createLazyFileRoute('/store/$storeKey/products/create')({
  component: () => <CreateProduct />,
});
