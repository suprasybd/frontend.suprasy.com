import { createLazyFileRoute } from '@tanstack/react-router';
import CreateProduct from '../../../../pages/products/create/CreateProduct';

export const Route = createLazyFileRoute('/store/$storeKey/product/create')({
  component: () => <CreateProduct />,
});
