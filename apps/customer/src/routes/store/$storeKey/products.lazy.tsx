import { createLazyFileRoute } from '@tanstack/react-router';
import Products from '../../../pages/products/Products';

export const Route = createLazyFileRoute('/store/$storeKey/products')({
  component: () => <Products />,
});
